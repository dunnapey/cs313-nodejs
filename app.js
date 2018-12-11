// APP configuration settings
var createError = require('http-errors');
var express = require('express');
var app = express(); //create instance of EXPRESS APP
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jquery = require('jquery');
var sessions = require('express-session');
//var bcrypt = require('bcrypt');
var router = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs') // sets view engine to EJS
    .use(logger('dev'))
    .use(express.json()) // support JSON encoded bodies
    .use(express.urlencoded({ extended: true })) // support url-encoded bodies
    .use(favicon("public/images/favicon2.png"))
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public'))) // sets static dir to 'public' dir
    .use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;