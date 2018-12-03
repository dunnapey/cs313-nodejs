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
        values: ['floor(random()*9999+1000)::int']
    }

    console.log('Inserted NEW CHANNEL');
    return await pool.query(query);
}

/******************************************************************************
* create NEW MESSAGE
******************************************************************************/
async function postMsg(req, res) {
    var parent = null;
    if (req.body.parent > 0) { parent = req.body.parent; }

    const query = {
        text: 'INSERT INTO messages (author, origin, content, threadParent) VALUES ($1,$2,$3,$4) RETURNING *;',
        values: [req.body.user, req.body.channel, req.body.content, parent]
    }
    
    console.log('Inserted NEW MESSAGE');
    return await pool.query(query).catch((err) => {console.log(err);});
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
        text: "SELECT id, author, origin, content, timezone('MST', postTime) as timeStamp, threadParent FROM messages WHERE origin = $1;",
        values: [req.params.channel]
    }

    console.log("Getting ALL MESSAGES in CHANNEL " + req.params.channel);
    return await pool.query(query);
}


// export MODELS
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