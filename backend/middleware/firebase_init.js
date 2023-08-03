var admin = require("firebase-admin");

const initFirebase = () => {
    var serviceAccount = require("../songms-eb7ed-firebase-adminsdk-vxr1b-3e46b6450c.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://songms-eb7ed-default-rtdb.firebaseio.com",
    });
};
module.exports = initFirebase;
