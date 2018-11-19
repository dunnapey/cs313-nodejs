var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {title:"MyApp"});
});

/* GET about page. */
router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/form', function(req, res) {
    res.render('form', {result: ''});
});

router.get('/prove09', function(req, res) {
    res.render('prove09');
})

router.get('/prove10', function(req, res) {
    res.render('prove10');
})

router.get('/prove11', function(req, res) {
    res.render('prove11');
})

router.get('/prove12', function(req, res) {
    res.render('prove12');
})

router.get('/prove13', function(req, res) {
    res.render('prove13');
})

router.get('/prove14', function(req, res) {
    res.render('prove14');
})

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