const express = require("express");
const cors = require("cors");
const http = require("http");
const initFirebase = require("../middleware/firebase_init");
const verify = require("../middleware/verify");
require("dotenv").config();
// const { cert } = require("firebase-admin/app");
const user = require("../controllers/user");
const songs = require("../controllers/songs");
const initSockets = require("../controllers/sockets");

class Server {
    constructor() {
        this.port = process.env.PORT;
        this.app = express();
        this.middlewares();
        this.routes();
        const server = http.createServer(this.app);
        initSockets(server);
    }

    middlewares() {
        this.app.use(cors()); // Enable CORS
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(initFirebase);
    }

    // Bind controllers to routes
    routes() {
        // check if username is unique --> used for registration page
        this.app.get("/api/checkUsername", user.checkUsername);
        // auth middleware for other routes
        this.app.use(verify);

        // user routes
        this.app.post("/api/register", user.register);
        this.app.get("/api/getUser", user.get);
        this.app.post("/api/updateImg", user.updateImg);
        this.app.post("/api/updateEmail", user.updateEmail);
        this.app.post("/api/updateBio", user.updateBio);
        this.app.get("/api/searchUsers", user.searchUsers);

        // songs routes
        this.app.post("/api/sendSong", songs.send);
        this.app.get("/api/retrieveSongs", songs.retrieve);
        this.app.post("/api/removeSong", songs.remove);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server running on port: ", this.port);
        });
    }
}

module.exports = Server;
