var express = require('express');
var router = express.Router();
var Account = require('../models/Account');
var common = require('../utils/common');

// Index page
//router.route('/').get(function(req, res) {
router.get('/', common.isLoggedIn, function(req, res) {
	Account.find({})
	.sort({userid: 1})
	.exec(function(err, userData) {
		if(err) throw res.json(err);
		else res.render('account/index', {userData:userData});
	});
});

// Create
router.get('/create', function(req, res) {
	let userData = req.flash('account')[0] || {};
	let errors = req.flash('errors')[0] || {};
	res.render('account/create', {userData:userData, errors:errors});
});

router.post('/', function(req, res) {
	Account.create(req.body, function(err, user) {
		if(err) {
			req.flash('account', req.body);
			req.flash('errors', common.parseError(err));
			return res.redirect('/account/create');
		}
		else {
			res.redirect('/login');
		}
	});
});

// Show
router.get('/:userid', function(req, res) {
	Account.findOne({userid: req.params.userid}, function(err, userData) {
		if(err) res.json(err);
		else res.render('account/userDetail', {userData:userData});
	});
});

// Edit
router.get('/:userid/edit', function(req, res) {
	let account = req.flash('account')[0];
	let errors = req.flash('errors')[0] || {};
	if(!account) {
		Account.findOne({userid: req.params.userid}, function(err, userData) {
			if(err) res.json(err);
			else res.render('account/edit', {userid:req.params.userid, userData:userData, errors:errors});
		});
	} else {
		console.log(errors);
		res.render('account/edit', {userid:req.params.userid, userData:account, errors:errors});
	}
});

// Update
router.put('/:userid', function(req, res, next) {
	Account.findOne({userid: req.params.userid})
	.select({password:1})
	.exec(function(err, userData) {
		if(err) res.json(err);

		userData.originalPassword = userData.password;
		userData.password = req.body.newPassword ? req.body.newPassword : userData.password;

		for(let param in req.body) {
			userData[param] = req.body[param];
		}

		userData.save(function(err, userData) {
			if(err) {
				req.flash('account', req.body);
				req.flash('errors', common.parseError(err));
				return res.redirect('/account/'+req.params.userid+'/edit');
			} else {
				res.redirect('/account/' + req.params.userid);
			}
		});
	});
});

module.exports = router;

function checkPermission(req, res, next) {
	Account.findOne({userid: req.params.userid}, function(err, userData) {
		if(err) {
			res.json(err);
		} else if(userData.userid != req.user.id) {
			return common.noPermission(req, res);
		} else {
			next();
		}
	});
}
