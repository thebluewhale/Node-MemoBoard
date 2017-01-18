var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./utils/passport');
// for Router
var home = require('./routes/home');
var account = require('./routes/account');
var post = require('./routes/post');

// DB settings
mongoose.connect('mongodb://localhost/Node-MemoBoard');
const db = mongoose.connection;
db.once('open', function() { console.log('db opened'); });
db.on('error', function() { console.log('db on error'); });

// Properties settings
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
	secret: "MySecret",
	saveUninitialized: true,
	resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.currentUser = req.user;
	next();
});
// Router settings
app.use('/', home);
app.use('/account', account);
app.use('/posts', post);

// Port settingx
app.listen(3000, function() { console.log('port : 3000'); });
//app.listen(3000, "192.168.0.11");
