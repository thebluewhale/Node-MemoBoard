var express = require('express');
var router  = express.Router();
var passport = require('../config/passport');

// Router for home
router.get('/', function(req, res){
  res.render('main/home');
});

router.get('/signin', function(req, res) {
	let userid = req.flash('userid')[0];
	let errors = req.flash('errors')[0] || {};

	res.render('main/signin', {
		userid: userid,
		errors: errors
	});
});

router.post('/signin', function(req, res, next) {
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
			res.redirect('/signin');
		}
	},
	passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/signin'
	})
);

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
