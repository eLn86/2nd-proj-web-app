require('dotenv').config({silent: true});
var express = require('express');
// var Debug = require('debug');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var lessMiddleware = require('less-middleware');
var methodOverride = require('method-override');

// Routers
var index = require('./routes/index');
var users = require('./routes/users');
var lessons = require('./routes/lessons');


//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
// var url = 'mongodb://admin:Misysia1@ds127842.mlab.com:27842/heroku_93x4lhsr';
var localMongoURL = 'mongodb://localhost/radiologium';

// Init app
const app = express();
// const debug = Debug('2nd-proj-web-app:app');

/**
 * Create HTTP server.
 */
const server = require('http').Server(app);

// Connect with Mongo DB
mongoose.connect(localMongoURL, function(err,db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', localMongoURL);
  }
});

// Init middel-ware
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Setup Sessions
app.use(session({secret: 'iloveui'}));
app.use(passport.initialize());
app.use(passport.session());
// Setup local strategy
require('./config/passport')(passport);

// Flash
app.use(flash());

// Method Override for http methods (allow PUT)
app.use(methodOverride('_method'));

// View Engine
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render('index');
})

app.use('/', index);
app.use('/secret', users);
app.use('/secret/lessons', lessons);

// listen
const port = 3000;
app.listen(port, function(){
    console.log('Radiologium running on port ' + port);
});
