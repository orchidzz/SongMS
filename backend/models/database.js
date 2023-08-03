const initFirebase = require("../middleware/firebase_init");
const admin = require("firebase-admin");
const geohash = require("ngeohash");

class Database {
    constructor(dev = false) {
        // if in development mode for testing, pass in true
        if (dev) {
            initFirebase();
        }
        this.realtimeDB = admin.database();
    }
    async #getUserImg(username) {
        try {
            let url = null;
            const path = `users/${username}`;

            const bucket = admin.storage().bucket();
            const [files] = await bucket.getFiles({
                prefix: path,
            });
            // there should only be 1 image for each unique users/username prefix
            if (files.length !== 0) {
                const file = files[0];
                url = await file.getSignedUrl({
                    action: "read",
                    expires: "03-01-2500",
                });
            }
            return url;
        } catch (error) {
            console.error("Error getting image URL:", error);
        }
    }

    async addUserImg(username, base64Img) {
        try {
            const bucket = admin.storage().bucket();
            // if an image already exists, delete before adding a new one
            if (this.#getUserImg(username) !== null) {
                const [files] = await bucket.getFiles({
                    prefix: `users/${username}`,
                });
                const imgToDelete = files.map((file) => file.delete());
                await Promise.all(imgToDelete);
            }
            const data = Buffer.from(base64Img.split(",")[1], "base64");
            const type = base64Img.split(";")[0].split("/")[1];
            const path = `users/${username}.${type}`;

            await bucket.file(path).save(data, {
                contentType: `image/${type}`,
            });
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }
    async usernameIsUnique(username) {
        const users = admin.firestore().collection("users");
        const querySnapshot = await users
            .where("username", "==", username)
            .get();
        if (!querySnapshot.empty) {
            return false;
        } else {
            return true;
        }
    }
    async addUser(user) {
        // user = {email: string, username: unique string (cannot be changed for identification purpose), bio: string}
        try {
            const users = admin.firestore().collection("users");
            await users.add(user);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    }

    async getUserInfo(userEmail) {
        try {
            const users = admin.firestore().collection("users");
            const res = await users.where("email", "==", userEmail).get();

            if (!res.empty) {
                const user = res.docs[0].data();
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting user:", error);
        }
    }

    async getReceivedSongs(username) {
        try {
            const songs = admin.firestore().collection("songs");
            const res = await songs.where("receiver", "==", username).get();

            let receivedSongs = [];
            res.forEach((songDocumentSnapshot) => {
                const songData = songDocumentSnapshot.data();
                const songId = songDocumentSnapshot.id;
                const song = { id: songId, ...songData };
                receivedSongs.push(song);
            });
            return receivedSongs;
        } catch (error) {
            console.error("Error getting songs by receiver:", error);
            return null;
        }
    }

    async updateUserBio(userEmail, bio) {
        try {
            const users = admin.firestore().collection("users");
            const res = await users.where("email", "==", userEmail).get();

            if (!res.empty) {
                const user = res.docs[0].ref;
                await user.update({ bio: bio });
            } else {
                console.log("User not found.");
            }
        } catch (error) {
            console.error("Error updating user bio:", error);
        }
    }

    async updateUserEmail(oldUserEmail, newUserEmail) {
        try {
            const users = admin.firestore().collection("users");
            const res = await users.where("email", "==", oldUserEmail).get();

            if (!res.empty) {
                const user = res.docs[0].ref;
                await user.update({ email: newUserEmail });
            } else {
                console.log("User not found.");
            }
        } catch (error) {
            console.error("Error updating user email:", error);
        }
    }

    async deleteUser(userEmail) {
        try {
            const users = admin.firestore().collection("users");
            const res = await users.where("email", "==", userEmail).get();

            if (!res.empty) {
                const user = res.docs[0].ref;
                await user.delete();
            } else {
                console.log("User not found.");
            }
            // also delete all songs where receiver = user
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    async addSong(song) {
        try {
            const songs = admin.firestore().collection("songs");
            await songs.add(song);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    }

    async deleteSong(songId) {
        try {
            const songs = admin.firestore().collection("songs");
            const res = await songs.where("id", "==", songId).get();

            if (!res.empty) {
                const song = res.docs[0].ref;
                await song.delete();
            } else {
                console.log("User not found.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }
    async getUsernameByEmail(email) {
        const user = await this.getUserInfo(email);
        if (user) {
            return user.email;
        } else {
            return null;
        }
    }
    async #getUserGeohash(username) {
        try {
            const res = await this.realtimeDB
                .ref(`users/${username}/geohash`)
                .once("value");
            const geohash = res.val();

            if (geohash !== null) {
                return geohash;
            } else {
                throw new Error(`Geohash not found for ${username}.`);
            }
        } catch (error) {
            console.error("Error getting geohash:", error);
        }
    }

    async updateGeohash(username, geohash) {
        try {
            this.realtimeDB.ref(`users/${username}/geohash`).set(geohash);
        } catch (error) {
            console.error("Error updating geohash:", error);
        }
    }

    async getNearbyUsers(username) {
        try {
            // source: https://gis.stackexchange.com/questions/18330/using-geohash-for-proximity-searches
            // precision = 5 bits => +-2.4 km ~ 1.5 mi
            // stored precision = 52 bits
            const userHash = await this.#getUserGeohash(username);
            const [longitude, latitude] = geohash.decode_int(userHash);
            const userRehashed = geohash.encode_int(latitude, longitude, 5);

            const neighbors = geohash.neighbors_int(userRehashed, 5);
            const minHashes = [userRehashed, ...neighbors];
            const maxHashes = minHashes.map((hash) => {
                return hash + 1;
            });
            const bounds = [];
            for (let i = 0; i < 9; i++) {
                let min = minHashes[i];
                let max = maxHashes[i];
                // rehash
                const [minLongitude, minLatitude] = geohash.decode_int(min, 5);
                const rehashedMin = geohash.encode_int(
                    minLatitude,
                    minLongitude
                );
                const [maxLongitude, maxLatitude] = geohash.decode_int(max, 5);
                const rehashedMax = geohash.encode_int(
                    maxLatitude,
                    maxLongitude
                );
                bounds.push([rehashedMin, rehashedMax]);
            }
            const nearbyUsers = [];
            bounds.forEach(async (bound) => {
                let res = await this.realtimeDB
                    .ref("users")
                    .orderByChild("geohash")
                    .startAt(bound[0])
                    .endAt(bound[1])
                    .once("value");

                res.forEach((userRes) => {
                    // Retrieve each user's data
                    const user = userRes.val();
                    nearbyUsers.push(user);
                });
            });

            return nearbyUsers;
        } catch (error) {
            console.error("Error finding users in range:", error);
            return [];
        }
    }

    async getUsersByUsernameKeyword(keyword) {
        try {
            const users = admin.firestore().collection("users");
            const lowerCaseKeyword = keyword.toLowerCase();

            const res = await users
                .where("username", ">=", lowerCaseKeyword)
                .where("username", "<", lowerCaseKeyword + "\uf8ff")
                .get();

            const searchedUsers = [];
            res.forEach((userDocumentSnapshot) => {
                const user = userDocumentSnapshot.data();
                searchedUsers.push(user);
            });

            return searchedUsers;
        } catch (error) {
            console.error("Error getting users by keyword:", error);
            return null;
        }
    }
}
module.exports = Database;
