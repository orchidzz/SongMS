const Database = require("../models/database");
const db = new Database();

async function send(req, res) {
    const data = req.body;
    let song = { ...data, datetime: new Date.getTime() };
    await db.addSong(song);
}
async function retrieve(req, res) {
    const username = await db.getUsernameByEmail(req.query.userEmail);
    const retrievedSongs = await db.getReceivedSongs(username);
    res.json(retrievedSongs);
}
async function remove(req, res) {
    const data = req.body;
    await db.deleteSong(data.songId);
}

module.exports = { send, retrieve, remove };
