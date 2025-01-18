const express = require("express");
const cors = require("cors");
const http = require("http");
const verify = require("../middleware/verify");
require("dotenv").config();
const { Server } = require("socket.io");
const Database = require("./database");
const db = new Database();
const { distanceBetweenGeohashes } = require("./../utils/geohashUtils");

// Note: now only support for one socket for each unique user only
class APIServer {
    constructor() {
        this.port = process.env.PORT;
        this.app = express();
        this.middlewares();

        // sockets init
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);
        this.sockets();
        this.rooms = {};

        this.routes();
    }

    middlewares() {
        this.app.use(cors()); // Enable CORS
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(verify); // verify authentication before API use
    }

    // Bind controllers to routes
    routes() {
        this.app.post("/api/geohash", async (req, res) => {
            try {
                const { roomId, geohash, socketId } = req.body; // roomId  = userName
                if (!roomId || roomId === "") {
                    throw new Error("Empty roomId");
                }
                if (!this.rooms[roomId]) {
                    this.rooms[roomId] = {
                        socketId: socketId,
                        geohash: geohash,
                        nearbyUsers: new Set([]),
                    };
                } else {
                    if (this.rooms[roomId].socketId != socketId) {
                        throw new Error(
                            `Account ${roomId} can only be active on one device at a time`
                        );
                    }
                    this.rooms[roomId].geohash = geohash;
                    this.rooms[roomId].socketId = socketId;
                }
                await db.updateGeohash(roomId, geohash);

                // get nearby users
                const nearbyUsers = await db.getNearbyUsers(roomId);
                // each room's nearbyUsers = users that have this user as a nearby user
                // for multi-socket for each unique user in the future: (ie. one account with app active on multiple devices at once)
                // use array of sets for nearbyUsers and array of socketId's ?
                for (const nearbyUser of nearbyUsers) {
                    if (!this.rooms[nearbyUser.userName]) {
                        this.rooms[nearbyUser.userName] = {
                            geohash: nearbyUser.geohash,
                            nearbyUsers: new Set([roomId]),
                        };
                    } else {
                        this.rooms[nearbyUser.userName].nearbyUsers.add(roomId);
                    }
                }
                //emit to frontend
                this.io.to(socketId).emit("update-nearby-user", {
                    nearbyUsers: nearbyUsers,
                });
                res.status(200).send("OK");
            } catch (error) {
                console.log("Error in geohash endpoint: ", error.message);
                res.status(500).send({
                    error: {
                        message: "Internal Server Error: " + error.message,
                        code: 500,
                    },
                });
            }
        });

        // app.post("/api/send-push-notif", async (req, res) => {
        //     try {
        //         const { token, title, body } = req.body;

        //         const response = await fetch(
        //             "https://fcm.googleapis.com/fcm/send",
        //             {
        //                 method: "POST",
        //                 headers: {
        //                     "Content-Type": "application/json",
        //                     Authorization: "Bearer " + accessToken,
        //                 },
        //                 body: JSON.stringify({
        //                     message: {
        //                         topic: "news",
        //                         token: token,
        //                         notification: {
        //                             title: title,
        //                             body: body,
        //                         },
        //                     },
        //                 }),
        //             }
        //         );

        //         const data = await response.json();
        //         if (response.ok) {
        //             res.status(200).send({ success: true, data });
        //         } else {
        //             res.status(400).send({ success: false, error: data });
        //         }
        //     } catch (error) {
        //         res.status(500).send({ success: false, error: error.message });
        //     }
        // });
    }

    sockets() {
        this.io.on("connection", (socket) => {
            socket.on("broadcast-geohash", async ({ userGeohash, user }) => {
                // update user geohash
                if (this.rooms[user]) {
                    this.rooms[user].geohash = userGeohash;

                    for (const [roomId, room] of Object.entries(this.rooms)) {
                        const { geohash, nearbyUsers, socketId } = room;

                        if (nearbyUsers.has(user)) {
                            if (
                                distanceBetweenGeohashes(geohash, userGeohash) >
                                2
                            ) {
                                nearbyUsers.delete(user);
                                const newNearbyUsers = await db.getNearbyUsers(
                                    roomId
                                );
                                for (const newNearbyUser of newNearbyUsers) {
                                    this.rooms[roomId].nearbyUsers.add(
                                        newNearbyUser
                                    );
                                }
                                // Emit an update-nearby-user event to frontend
                                if (socketId) {
                                    this.io
                                        .to(socketId)
                                        .emit("update-nearby-user", {
                                            nearbyUsers: newNearbyUsers,
                                        });
                                }
                            }
                        }
                    }
                }
            });

            // Handle user disconnect
            socket.on("disconnect", async () => {
                let user;
                // Remove the user from rooms
                for (const [roomId, room] of Object.entries(this.rooms)) {
                    const { nearbyUsers, socketId } = room;

                    if (nearbyUsers.has(roomId)) {
                        nearbyUsers.delete(roomId);
                    }
                    if (socketId == socket.id) {
                        user = roomId;
                    }
                }

                // Update user's geohash to empty string
                if (user) {
                    await db.updateGeohash(user, "");
                    delete this.rooms[user];
                }
            });
        });
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log("Server running on port: ", this.port || 3000);
        });
    }
}

module.exports = APIServer;
