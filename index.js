var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
// for Router
var home = require('./routes/home');
var account = require('./routes/account');
var post = require('./routes/post');

// DB settings
mongoose.connect('mongodb://localhost/Node-MemoBoard');
const db = mongoose.connection;
db.on('error', function() { console.log('db on error'); });
db.once('open', function() { console.log('db opened'); });

// Properties settings
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

// Router settings
app.use('/', home);
app.use('/account', account);
app.use('/post', post);

// Port settingx
app.listen(3000, function() { console.log('port : 3000'); });
