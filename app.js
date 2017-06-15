var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var lessMiddleware = require('less-middleware');

// Init app
var app = express();

// Connect with Mongo DB
mongoose.connect('mongodb://localhost/radiologium' || process.env.MONGOLAB_URI || process.env.MONGODB_URI);

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

// Setup sessions
app.use(session( { secret: 'ilovevdi'}));
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
