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

function formatTime(timestamp) {
    var time = new Date(timestamp);
    time = date.format(time, 'D MMM YYYY h:mm A');
    timestamp = time;
    return timestamp;
}

async function getChnlMsgs(req, res) {
    var result = await model.getChnlMsgs(req);
    result = result.rows;

    // FORMAT TIMESTAMPS
    result.forEach((msg) => {msg.timestamp = formatTime(msg.timestamp)});

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
        req.session.uid = result[0].id;
        req.session.loggedIn = true;
        var loggedIn = req.session.loggedIn;

        console.log("Logged in as " + req.session.uname);
        var msgs = null;
        var hasMsgs = false;

        // if has joinCode, join channel. if not, create channel
        if (req.body.joinCode) {
            var joinCode = req.body.joinCode;
            msgs = await getChnlMsgs(req);
            if (msgs) {hasMsgs = true;}
            console.log(msgs);
        } else {
            var newChnl = await startChnl(req);
            var joinCode = newChnl.joinCode;
        }
        
        res.render('channel', {uid: req.session.uid, loggedIn: loggedIn, joinCode: joinCode, msgs: msgs, hasMsgs: hasMsgs});
    } else { res.render('index', {success: false}); }
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