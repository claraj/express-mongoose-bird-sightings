var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('express-flash');
var session = require('express-session');
var hbs = require('hbs');
var helpers = require('./hbshelpers/helpers');

// Set the environment variable MONGO_URL to the correct URL
var db_url = process.env.MONGO_URL;
mongoose.Promise = global.Promise;

// And connect to mongoose, log success or error
mongoose.connect(db_url, { useMongoClient: true })
  .then( () => {  console.log('Connected to MongoDB') } )
  .catch( (err) => { console.log('Error Connecting to MongoDB', err); });

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerHelper(helpers)      // Register the helper functions with hbs

app.use(session({ secret: 'top secret!', resave: false, saveUninitialized: false} ));
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Consider invalid ObjectIDs as a type of 404 error.
  if (err.kind === 'ObjectId' && err.name === 'CastError') {
     err.status = 404;
   }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
