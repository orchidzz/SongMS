var admin = require("firebase-admin");
const geohash = require("ngeohash");

class Database {
    constructor(dev = false) {
        // if in development mode for testing database module alone, pass in true
        if (dev) {
            var serviceAccount = require("../songms-eb7ed-firebase-adminsdk-vxr1b-3e46b6450c.json");
            admin.initializeApp({
                creadential: admin.credential.cert(serviceAccount),
                databaseURL: "https://songms-eb7ed-default-rtdb.firebaseio.com",
            });
        }

        this.realtimeDB = admin.database();
    }

    async #getUserGeohash(user) {
        try {
            const res = await this.realtimeDB
                .ref(`users/${user}/geohash`)
                .once("value");
            const geohash = res.val();

            if (geohash !== null) {
                return geohash;
            } else {
                throw new Error(`Geohash not found for ${user}.`);
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

    async getNearbyUsers(user) {
        try {
            // how to perform proximity search with geohash
            // source: https://gis.stackexchange.com/questions/18330/using-geohash-for-proximity-searches
            // precision = 5 bits => +-2.4 km ~ 1.5 mi
            // stored precision = 52 bits

            // more explanation on how/why geohash works
            // https://duncanacampbell.medium.com/demystifying-compound-location-queries-in-firebase-740e88a3fa9a
            const userHash = await this.#getUserGeohash(user);

            if (!userHash || userHash == "") {
                return [];
            }
            const { longitude, latitude } = geohash.decode(userHash);
            const userRehashed = geohash.encode_int(latitude, longitude, 5);
            const neighbors = geohash.neighbors_int(userRehashed, 5);
            const minHashes = Array.from(new Set([userRehashed, ...neighbors])); // ensure bounds have no duplicates --> optimize db queries
            const maxHashes = minHashes.map((hash) => {
                return hash + 1;
            });
            const bounds = [];
            for (let i = 0; i < minHashes.length; ++i) {
                let min = minHashes[i];
                let max = maxHashes[i];
                // rehash
                const minGeohash = geohash.decode_int(min, 5);
                const minLatitude = minGeohash.latitude;
                const minLongitude = minGeohash.longitude;
                const rehashedMin = geohash.encode(
                    minLatitude,
                    minLongitude,
                    52
                );
                const maxGeohash = geohash.decode_int(max, 5);
                const maxLatitude = maxGeohash.latitude;
                const maxLongitude = maxGeohash.longitude;
                const rehashedMax = geohash.encode(
                    maxLatitude,
                    maxLongitude,
                    52
                );
                bounds.push([rehashedMin, rehashedMax]);
            }

            const boundsPromises = bounds.map(async (bound) => {
                const res = await this.realtimeDB
                    .ref("users")
                    .orderByChild("geohash")
                    .startAt(bound[0])
                    .endAt(bound[1])
                    .once("value");

                const users = [];
                res.forEach((userRes) => {
                    users.push({
                        userName: userRes.key,
                        ...userRes.val(),
                    });
                });
                return users;
            });

            const results = await Promise.all(boundsPromises);

            const nearbyUsers = results.flat();
            return nearbyUsers;
        } catch (error) {
            console.error("Error finding users in range:", error);
            return [];
        }
    }
}
module.exports = Database;
