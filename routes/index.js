var express = require('express');
var router = express.Router();
var WS = require('express-ws')(router);

var controller = require('../controller.js');

var clients = [];

// get HOME page
router.get('/', (req, res) => { res.render('index'); });

// login from HOME page
router.post('/', controller.login);

// get CHANNEL page
router.get('/channel', (req, res) => { res.render('channel'); });

// get CHANNEL MSGS
// router.get('/getChnlMsgs', controller.getChnlMsgs);

// get ABOUT page
router.get('/about', (req, res) => { res.render('about'); });

// get SIGNUP page
router.get('/signup', (req, res) => { res.render('signup'); });

// LOGOUT a user
router.post('/logout', controller.logout);


/* TESTING WEBSOCKETS */

// CONNECT a client
router.ws('/connect', (ws) => {
	clients.push(ws);
	console.log("Num Clients: " + clients.length);
});

// listen for message from connection
router.ws('/channel', (ws) => {
	ws.on('message', (msg) => {
		console.log(msg[name='user']);
		//controller.postMsg(msg); //send msg on to DB
		msg = JSON.parse(msg);
		clients.forEach((client) => client.send(msg));
	});
});


/******************************************************************************
* PUBLIC or STATIC DIR endpoints (mostly for other assignments)
******************************************************************************/
// get ASSIGNMENTS page
router.get('/assignments', function(req, res) {
	res.render('assignments');
});

// get test FORM CALCULATOR page
router.get('/form', function(req, res) {
	res.render('form', {result: ''});
});

// get POSTAL RATE CALCULATOR page
router.post('/getPostalRate', function(req, res) {
	var weight = parseInt(req.body.weight);
	var mailtype = req.body.mailtype;
	res.render('postalrate', {weight: weight, mailtype: mailtype});
});

// get test calculator
router.post('/form', function(req, res) {
	var int1 = parseInt(req.body.int1);
	var int2 = parseInt(req.body.int2);
	var operator = req.body.operator;
	var result;

	switch(operator) {
		case '+':
		result = int1 + int2;
		break;
		case '-':
		result = int1 - int2;
		break;
		case '*':
		result = int1 * int2;
		break;
		case '/':
		result = int1 / int2;
		break;
		default:
		result = 0;
	}
	res.render('form', {result: result});
	res.end();
});

module.exports = router;