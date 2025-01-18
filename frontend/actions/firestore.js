import { firestore, storage, database } from "./../index";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    getDocs,
    where,
    limit,
    orderBy,
    writeBatch,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { remove, ref as dbRef } from "firebase/database";

export const usernameIsUnique = async (username) => {
    const usersCollection = collection(firestore, "users");
    const existingUserQuery = query(
        usersCollection,
        where("username", "==", username),
        limit(1)
    );
    const querySnapshot = await getDocs(existingUserQuery);
    if (!querySnapshot.empty) {
        return false;
    } else {
        return true;
    }
};
export const createUser = async (uid, username, email, bio) => {
    try {
        await setDoc(doc(firestore, "users", uid), {
            username: username,
            email: email,
            bio: bio,
            spotifyRefreshToken: "",
            lastSendDatetime: 0,
        });
    } catch (error) {
        console.error("Error adding user: ", error);
        throw error;
    }
};
export const updateUser = async (uid, updatedData) => {
    try {
        await updateDoc(doc(firestore, "users", uid), updatedData);
    } catch (error) {
        console.error("Error updating user: ", error);
        throw error;
    }
};
export const getUser = async (uid) => {
    try {
        const userDoc = await getDoc(doc(firestore, "users", uid));
        if (userDoc.exists) {
            const userData = userDoc.data();
            const userImg = await getUserImage(uid);
            if (userImg) {
                return { userImg: userImg, ...userData };
            }
            return { ...userData };
        } else {
            console.log("User not found");
            return null;
        }
    } catch (error) {
        console.error("Error getting user: ", error);
        throw error;
    }
};

export const deleteUserFirestore = async (uid) => {
    try {
        await deleteDoc(doc(firestore, "users", uid));
        // delete all received songs ?
        const querySnapshot = await getDocs(
            collection(firestore, "songs", uid, "received")
        );
        const b = writeBatch(firestore);
        querySnapshot.forEach((document) => {
            b.delete(doc(firestore, "songs", uid, "received", document.id));
        });
        await b.commit();
        await deleteUserImage(uid);
    } catch (error) {
        console.error("Error deleting user: ", error);
        throw error;
    }
};
export const getUsersByUsernameKeyword = async (keyword) => {
    try {
        const usersCollectionQuery = query(
            collection(firestore, "users"),
            where("username", ">=", keyword),
            where("username", "<=", keyword + "\uf8ff"),
            limit(5)
        );
        const querySnapshot = await getDocs(usersCollectionQuery);

        const promises = querySnapshot.docs.map(async (doc) => {
            const user = doc.data();
            const img = await getUserImage(doc.id);
            if (img) {
                return {
                    uid: doc.id,
                    username: user.username,
                    bio: user.bio,
                    userImg: img,
                };
            } else {
                return {
                    uid: doc.id,
                    username: user.username,
                    bio: user.bio,
                };
            }
        });

        const users = await Promise.all(promises);

        return users;
    } catch (error) {
        console.error("Error searching for users: ", error);
    }
};
export const addSong = async (
    uid,
    sender,
    receiver,
    songName,
    artistName,
    spotifyUri = "",
    youtubeUri = ""
) => {
    try {
        // add url to song's img?
        const datetime = new Date().getTime();
        // songs/{receiver.uid}/receiver/{datetime + sender.uid} --> only prioritize getting received songs not sent songs
        // and prioritize order by time received. Added sender.uid because of situation when two senders send
        // at the same time
        await setDoc(
            doc(
                firestore,
                "songs",
                receiver,
                "received",
                datetime + "-" + sender
            ),
            {
                sender,
                receiver,
                songName,
                artistName,
                datetime,
                spotifyUri: spotifyUri,
                youtubeUri: youtubeUri,
            }
        );
        await updateUser(uid, { lastSendDatetime: datetime });
    } catch (error) {
        console.error("Error adding song: ", error);
        throw error;
    }
};
export const searchSongsByReceiver = async (receiver) => {
    try {
        const songsCollectionQuery = query(
            collection(firestore, "songs", receiver, "received"),
            orderBy("datetime", "desc")
        );
        const querySnapshot = await getDocs(songsCollectionQuery);
        let songs = [];
        querySnapshot.forEach((doc) => {
            const songData = doc.data();
            songs.push({ id: doc.id, ...songData });
        });

        return songs;
    } catch (error) {
        console.error("Error searching for received songs: ", error);
        throw error;
    }
};

export const getClientSecrets = async (serviceClient) => {
    try {
        const secretDoc = await getDoc(
            doc(firestore, "secrets", serviceClient)
        );
        if (secretDoc.exists) {
            const data = secretDoc.data();
            return { ...data };
        } else {
            console.log("Client secret not found");
            return null;
        }
    } catch (error) {
        console.error("Error getting secret: ", error);
        throw error;
    }
};

export const getUserImage = async (uid) => {
    const storageRef = ref(storage, `userImages/${uid}`);
    try {
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        if (error.code === "storage/object-not-found") {
            return null;
        }
        console.error("Error retrieving user image:", error);
        throw error;
    }
};

export const uploadUserImage = async (uri, uid) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, `userImages/${uid}`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading user image:", error);
        throw error;
    }
};

const deleteUserImage = async (uid) => {
    const storageRef = ref(storage, `userImages/${uid}`);
    try {
        await deleteObject(storageRef);
    } catch (error) {
        if (error.code === "storage/object-not-found") {
            return;
        }
        console.error("Error deleting user image:", error);
        throw error;
    }
};

export const removeGeohash = async (userName) => {
    const reference = dbRef(database, `users/${userName}`);

    try {
        await remove(reference);
    } catch (error) {
        console.error("Error deleting geohash:", error);
    }
};
