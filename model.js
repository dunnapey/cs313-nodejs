// create DATABASE connection
const {Pool} = require('pg'); // require PostgreSQL
const db = process.env.DATABASE_URL; // DB CONNECTION
const pool = new Pool({connectionString: db, ssl: true}); // create POOL instance

/******************************************************************************
* return ALL CHANNELS - only for ADMIN use!
******************************************************************************/
async function getAllChnls(req, res) {
    const query = { text: 'SELECT * FROM channels' }

    console.log('Returned ALL CHANNELS');
    return await pool.query(query);
}

/******************************************************************************
* return ALL MESSAGES - only for ADMIN use!
******************************************************************************/
async function getAllMsgs(req, res) {
    const query = { text: "SELECT id, author, origin, content, timezone('MST', postTime) as timeStamp, threadParent FROM messages;" }

    console.log('Returned ALL MESSAGES');
    return await pool.query(query);
}

/******************************************************************************
* return ALL USERS - only for ADMIN use!
******************************************************************************/
async function getAllUsers(req, res) {
    const query = { text: 'SELECT * FROM users;' }

    console.log('Returned ALL USERS');
    return await pool.query(query);
}

// check if USER in DB
async function getUser(req, res) {
    const query = {
        text: "SELECT uname, pwd FROM users WHERE uname = $1;",
        values: [req.body.uname]
    }

    return await pool.query(query);
}

/******************************************************************************
* create NEW USER - for new user sign up
******************************************************************************/
async function registerUser(req, res) {
    const query = {
        text: 'INSERT INTO users (fname, lname, uname, pwd, email) VALUES ($1,$2,$3,$4,$5) RETURNING fname, lname, uname;',
        values: [req.body.fname, req.body.lname, req.body.uname, req.body.pwd, req.body.email]
    }

    console.log('Inserted NEW USER');
    return await pool.query(query);
}

/******************************************************************************
* create NEW CHANNEL - for user to create new chat channel
******************************************************************************/
async function startChnl(req, res) {
    const query = {
        text: 'INSERT INTO channels (joinCode) VALUES ($1) RETURNING *;',
        values: [Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000]
    }

    console.log('Inserted NEW CHANNEL');
    return await pool.query(query);
}

/******************************************************************************
* create NEW MESSAGE
******************************************************************************/
async function postMsg(msg) {
    var parent = null;
    if (msg.parent > 0) { parent = msg['parent']; }

    const query = {
        text: 'INSERT INTO messages (author, origin, content, threadParent) VALUES ($1,$2,$3,$4);',
        values: [msg[name='user'], msg[name='channel'], msg[name='content'], parent]
    }
    
    console.log('Inserted NEW MESSAGE');
    pool.query(query).catch((err) => {console.log(err);});
}

/******************************************************************************
* return a single USER's MESSAGES
******************************************************************************/
async function getUserMsgs(req, res) {
    const query = {
        text: "SELECT id, author, origin, content, timezone('MST', postTime) as timeStamp, threadParent FROM messages WHERE author = $1;",
        values: [req.body.user]
    }

    console.log("Returned a single USER's MESSAGES");
    return await pool.query(query);
}

/******************************************************************************
* return a single USER's MESSAGES in a given CHANNEL
******************************************************************************/
async function getUserChnlMsgs(req, res) {
    const query = {
        text: "SELECT id, author, origin, content, timezone('MST', postTime) as timeStamp, threadParent FROM messages WHERE author = $1 AND origin = $2;",
        values: [req.body.user, req.body.channel]
    }

    console.log("Getting USER'S MSGS in CHANNEL " + req.body.channel);
    return await pool.query(query);
}

/******************************************************************************
* return ALL MESSAGES in a given CHANNEL
******************************************************************************/
async function getChnlMsgs(req, res) {
    const query = {
        text: "SELECT u.fname, u.lname, m.id, m.author, m.origin, m.content, timezone('MST', m.postTime) as timeStamp, m.threadParent FROM messages AS m JOIN users AS u ON(m.author = u.id) JOIN channels as c ON(m.author = u.id) WHERE c.joinCode = $1 ORDER BY timeStamp;",
        values: [req.body.joinCode]
    }

    console.log("Getting ALL MESSAGES in CHANNEL " + req.body.joinCode);
    return await pool.query(query);
}


// export MODELS
module.exports = {
    getAllChnls: getAllChnls,
    getAllMsgs: getAllMsgs,
    getAllUsers: getAllUsers,
    registerUser: registerUser,
    getUser: getUser,
    startChnl: startChnl,
    postMsg: postMsg,
    getUserMsgs: getUserMsgs,
    getUserChnlMsgs: getUserChnlMsgs,
    getChnlMsgs: getChnlMsgs
}