var model = require('./model.js');
var date = require('date-and-time');

/* FOR ADMIN USE ONLY!!! */
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

/* FOR CLIENT USE */
async function registerUser(req, res) {
    var result = await model.registerUser(req, res);
    res.json(result.rows);
    console.log("Registered new USER!");
}

async function startChnl(req, res) {
    var result = await model.startChnl(req);
    //res.json(result.rows);
    console.log("Started a new CHANNEL!");
    return result.rows;
}

async function postMsg(msg) {
    model.postMsg(msg);
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
    var result = await model.getChnlMsgs(req);
    result = result.rows;

    // FORMAT TIMESTAMPS
    for (var i = 0; i < result.length; i++) {
        var time = new Date(result[i].timestamp);
        time = date.format(time, 'D MMM YYYY h:mm A');
        result[i].timestamp = time;
    }

    console.log("Received CHANNEL'S MSGS!");
    return result;
}

// check if user in DB when logging in
async function getUser(req, res) {
    var result = await model.getUser(req, res);
    return result;
}

async function login(req, res) {
    // login a user
    var uname = req.body.uname;
    var pwd = req.body.pwd;

    var result = await getUser(req, res);
    result = result.rows;

    if (uname === result[0].uname && pwd === result[0].pwd) {
        req.session.uname = uname;
        req.session.loggedIn = true;

        console.log("Logging in");

        // if has joinCode, join channel. if not, create channel
        if (req.body.joinCode) {
            var joinCode = req.body.joinCode;
            var msgs = await getChnlMsgs(req);
            msgs = msgs.rows;
        } else {
            var newChnl = await startChnl(req);
            var joinCode = newChnl.joinCode;
            var msgs = null;
        }

        return res.render('channel', {joinCode: joinCode, msgs: msgs});
    } else { return res.redirect('/'); }
}

async function logout(req, res) {
    // logout user
    req.session.destroy;

    // redirect to login
    res.redirect('/');
}

async function isLoggedIn(req, res) {
    // verify user logged in
    return req.session.loggedIn;
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
    getChnlMsgs: getChnlMsgs,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn
}