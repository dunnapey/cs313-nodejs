var express = require('express');
var router = express.Router();

var controller = require('../controller.js');

// get HOME page
router.get('/', (req, res) => { res.render('index'); });

// get CHANNEL page
router.get('/channel', (req, res) => { res.render('channel'); })

// get CHANNEL MSGS
router.get('/channel/:channel', controller.getChnlMsgs);

// get a single USER'S CHANNEL MSGS
router.post('/channel', controller.getUserChnlMsgs);

router.post('/postMsg', controller.postMsg);

// get ABOUT page
router.get('/about', (req, res) => { res.render('about'); });

// get LOGIN page
router.get('/login', (req, res) => { res.render('login'); });

// get SIGNUP page
router.get('/signup', (req, res) => { res.render('signup'); });



/******************************************************************************
* PUBLIC or STATIC DIR endpoints
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