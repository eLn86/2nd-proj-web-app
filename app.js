require('dotenv').config({silent: true});
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var lessMiddleware = require('less-middleware');
// var MongoStore = require('connect-mongo')(session);


//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var url = 'mongodb://admin:Misysia1@ds127842.mlab.com:27842/heroku_93x4lhsr';

// Init app
var app = express();

// Connect with Mongo DB
mongoose.connect('mongodb://localhost/radiologium', function(err,db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', process.env.MONGODB_URI);
  }
});
mongoose.Promise = global.Promise;

// Setup sessions
// app.use(cookieParser(process.env.SESSION_SECRET));
// app.use(session({
//  secret: process.env.SESSION_SECRET,
//  cookie: { maxAge: 3600000 },
//  resave: false,
//  saveUninitialized: true,
//  store: new MongoStore({
//    url: process.env.MONGODB_URI,
//    autoReconnect: true
//  })
// }));

// Init middel-ware
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Setup Sessions
app.use(session({secret: 'iloveui'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Setup local-strategy
require('./config/passport')(passport);

// Routes
require('./routes/routes')(app, passport);

// listen
app.listen(3000, function(){
    console.log('listening on port 3000');
});

module.exports = app;
