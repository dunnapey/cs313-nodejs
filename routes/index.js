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