const Database = require("../models/database");
const db = new Database();

async function register(req, res) {
    const data = req.body;
    let user = { ...data };
    await db.addUser(user);
}
async function get(req, res) {
    const user = await db.getUserInfo(req.query.userEmail);
    res.json(user);
}
async function updateImg(req, res) {
    const data = req.body;
    await db.updateImg(data.userImg);
}
async function updateEmail(req, res) {
    const data = req.body;
    await db.updateUserEmail(req.query.userEmail, data.userEmail);
}
async function updateBio(req, res) {
    const data = req.body;
    await db.updateUserBio(req.query.userEmail, data.userBio);
}

async function checkUsername(req, res) {
    const isValidUsername = await db.usernameIsUnique(req.query.username);
    if (isValidUsername) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
}

async function searchUsers(req, res) {
    const searchedUsers = await db.getUsersByUsernameKeyword(req.query.keyword);
    res.json({ users: searchedUsers });
}
// in dev
async function remove(req, res) {
    await db.deleteUser(req.query.userEmail);
}
module.exports = {
    get,
    register,
    remove,
    updateBio,
    updateEmail,
    updateImg,
    checkUsername,
    searchUsers,
};
