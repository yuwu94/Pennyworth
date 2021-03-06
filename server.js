// get all the tools needed
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash'); //passing session flashdata messages
var methodOverride = require('method-override');

var morgan       = require('morgan'); //HTTP request logger middleware for node.js
var cookieParser = require('cookie-parser'); //parse cookie header and populate req.cookies with an object keyed by the cookie names
var bodyParser   = require('body-parser'); //body parsing middleware
var session      = require('express-session');
var path = require('path');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(path.join(__dirname, 'public')));


// required for passport
app.use(session({
	secret: 'ilovescotchscotchyscotchscotch' 
 })); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
var routes = require('./app/routes.js')(passport); // load our routes and pass in our app and fully configured passport
var api = require('./app/api.js')(app);
app.use('/', routes);


// launch ======================================================================
app.listen(port);
console.log('Running through the 6 on port ' + port);