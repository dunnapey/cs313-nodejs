var express = require('express');
var router = express.Router();

// create DATABASE connection
const {Pool} = require('pg'); // require PostgreSQL
const db = process.env.DATABASE_URL; // DB CONNECTION
const pool = new Pool({connectionString: db, ssl: true}); // create POOL instance

/******************************************************************************
* return ALL CHANNELS - only for ADMIN use!
******************************************************************************/
router.get('/admin/channels', (req, res) => {
    const query = { text: 'SELECT * FROM channels' }

    pool.query(query)
        .then(result => {console.log('Returned ALL CHANNELS'); res.send({rows:result.rows}); pool.end();})
        .catch(e => console.error(e.stack));
});

/******************************************************************************
* return ALL MESSAGES - only for ADMIN use!
******************************************************************************/
router.get('/admin/messages', (req, res) => {
    const query = { text: "SELECT id, author, origin, content, timezone('MST', postTime) as timeStamp, threadParent FROM messages;" }

    pool.query(query)
        .then(result => {console.log('Returned ALL MESSAGES'); res.send({rows: result.rows}); pool.end();})
        .catch(e => console.error(e.stack));
});

/******************************************************************************
* return ALL USERS - only for ADMIN use!
******************************************************************************/
router.get('/admin/users', (req, res) => {
    const query = { text: 'SELECT * FROM users;' }

    pool.query(query)
        .then(result => {console.log('Returned ALL USERS'); res.send({rows: result.rows}); pool.end();})
        .catch(e => console.error(e.stack));
});

/******************************************************************************
* create NEW USER - for new user sign up
******************************************************************************/
router.post('/newUser', (req, res) => {
    const query = {
        text: 'INSERT INTO users (fname, lname, uname, pwd, email) VALUES ($1,$2,$3,$4,$5) RETURNING *;',
        values: [req.body.fname, req.body.lname, req.body.uname, req.body.pwd, req.body.email]
    }

    pool.query(query)
        .then(result => {console.log('Inserted NEW USER'); res.send({rows: result.rows}); pool.end();})
        .catch(e => console.error(e.stack));
});

/******************************************************************************
* create NEW CHANNEL - for user to create new chat channel
******************************************************************************/
router.post('/user/newChannel', (req, res) => {
    const query = {
        text: 'INSERT INTO channels (joinCode) VALUES ($1) RETURNING *;',
        values: ['floor(random()*9999+1000)::int']
    }

    pool.query(query)
        .then(result => {console.log('Inserted NEW CHANNEL'); res.send({rows: result.rows}); pool.end();})
        .catch(e => console.error(e.stack));
});

/******************************************************************************
* create NEW MESSAGE
******************************************************************************/
router.post('/channel/newMessage', (req, res) => {
    const query = {
        text: 'INSERT INTO messages (author, origin, content, threadParent) VALUES ($1,$2,$3,$4) RETURNING *;',
        values: [req.body.user, req.body.channel, req.body.content, req.body.parent]
    }

    pool.query(query)
        .then(result => {console.log('Inserted NEW MESSAGE'); res.send({rows: result.rows}); pool.end();})
        .catch(e => console.error(e.stack));
});

/******************************************************************************
* return a single USER's MESSAGES
******************************************************************************/
router.get('/user/messages', (req, res) => {
    const query = {
        text: "SELECT id, author, origin, content, timezone('MST', postTime) as timeStamp, threadParent FROM messages WHERE author = $1;",
        values: [req.body.user]
    }

    pool.query(query)
        .then(result => {console.log("Returned a single USER's MESSAGES"); res.send({rows: result.rows}); pool.end();})
        .catch(e => console.error(e.stack));
});

/******************************************************************************
* return a single USER's MESSAGES in a given CHANNEL
******************************************************************************/
router.get('/user/channel/messages', (req, res) => {
    const query = {
        text: "SELECT id, author, origin, content, timezone('MST', postTime) as timeStamp, threadParent FROM messages WHERE author = $1 AND origin = $2;",
        values: [req.body.user, req.body.channel]
    }

    pool.query(query)
        .then(result => {console.log("Returned a single USER's MESSAGES in channel " + req.body.channel); res.send({rows: result.rows}); pool.end();})
        .catch(e => console.error(e.stack));
});

/******************************************************************************
* return ALL MESSAGES in a given CHANNEL
******************************************************************************/
router.get('/channel/messages', (req, res) => {
    const query = {
        text: "SELECT id, author, origin, content, timezone('MST', postTime) as timeStamp, threadParent FROM messages WHERE origin = $2;",
        values: [req.body.channel]
    }

    pool.query(query)
        .then(result => {console.log("Returned ALL MESSAGES in channel " + req.body.channel); res.send({rows: result.rows}); pool.end();})
        .catch(e => console.error(e.stack));
});


module.exports = router;