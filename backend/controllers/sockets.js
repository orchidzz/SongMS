const socketIo = require("socket.io");
const Database = require("../models/database");
const db = new Database();

const sockets = (server) => {
    const io = socketIo(server);

    const locationTracking = io.of("/geohash");
    locationTracking.on("connection", (socket) => {
        socket.on("update", async (data) => {
            await db.updateGeohash(data.username, data.geohash);
        });
        socket.on("getNearby", async (data) => {
            const nearbyUsers = await db.getNearbyUsers(data.username);
            locationTracking.emit("nearby", nearbyUsers);
        });
        socket.on("disconnect", async (data) => {
            await db.updateGeohash(data.username, null);
        });
    });
};

module.exports = { sockets };
