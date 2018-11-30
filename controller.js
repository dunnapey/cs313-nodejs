var model = require('./model.js');

async function getAllChnls(req, res) {
    var result = await model.getAllChnls(req, res);
    res.json(result.rows);
    console.log("Received ALL CHANNELS!");
}

async function getAllMsgs(req, res) {
    var result = await model.getAllMsgs(req, res);
    res.json(result.rows);
    console.log("Received ALL MSGS!");
}

async function getAllUsers(req, res) {
    var result = await model.getAllUsers(req, res);
    res.json(result.rows);
    console.log("Received ALL USERS!");
}

async function registerUser(req, res) {
    var result = await model.registerUser(req, res);
    res.json(result.rows);
    console.log("Registered new USER!");
}

async function startChnl(req, res) {
    var result = await model.startChnl(req, res);
    res.json(result.rows);
    console.log("Started a new CHANNEL!");
}

async function postMsg(req, res) {
    var result = await model.postMsg(req, res);
    res.json(result.rows);
    console.log("Posted a new MSG!");
}

async function getUserMsgs(req, res) {
    var result = await model.getUserMsgs(req, res);
    res.json(result.rows);
    console.log("Received USER'S MSGS!");
}

async function getUserChnlMsgs(req, res) {
    var result = await model.getUserChnlMsgs(req, res);
    res.json(result.rows);
    console.log("Received USER'S MSGS in CHANNEL!");
}

async function getChnlMsgs(req, res) {
    var result = await model.getChnlMsgs(req, res);
    res.json(result.rows);
    console.log("Received CHANNEL'S MSGS!");
}



module.exports = {
    getAllChnls: getAllChnls,
    getAllMsgs: getAllMsgs,
    getAllUsers: getAllUsers,
    registerUser: registerUser,
    startChnl: startChnl,
    postMsg: postMsg,
    getUserMsgs: getUserMsgs,
    getUserChnlMsgs: getUserChnlMsgs,
    getChnlMsgs: getChnlMsgs
}