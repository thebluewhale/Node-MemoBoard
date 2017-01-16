var express = require('express');
var router  = express.Router();
var passport = require('../utils/passport');
var Account = require('../models/Account');
var common = require('../utils/common');

// Router for home
router.get('/', function(req, res){
  res.render('home/home');
});

router.get('/login', function(req, res) {
	let userid = req.flash('userid')[0];
	let errors = req.flash('errors')[0] || {};

	res.render('home/login', {
		userid: userid,
		errors: errors
	});
});

router.post('/login', function(req, res, next) {
		let errors = {};
		let isValid = true;
		if(!req.body.userid) {
			isValid = false;
			errors.userid = 'enter your ID';
		} else if(!req.body.password) {
			isValid = false;
			errors.password = 'enter your password';
		}

		if(isValid) {
			next();
		} else {
			req.flash('errors', errors);
			res.redirect('/login');
		}
	},
	passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login'
	})
);

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

router.get('/allusers', common.isLoggedIn, function(req, res) {
	if(req.user.userid != 'master') {
		res.redirect('/');
	} else {
		Account.find({})
		.sort({userid: 1})
		.exec(function(err, userData) {
			if(err) throw res.json(err);
			else res.render('home/allusers', {userData:userData});
		});
	}
});

module.exports = router;
