var express = require('express');
var router = express.Router();
var Account = require('../models/Account');

// Index page
router.route('/').get(function(req, res) {
	Account.find({})
	.sort({userid: 1})
	.exec(function(err, userData) {
		if(err) throw res.json(err);
		else res.render('account/index', {userData:userData});
	});
});

// Create
router.get('/create', function(req, res) {
	res.render('account/create', {user:{}});
});

router.post('/', function(req, res) {
	Account.create(req.body,function(err, user) {
		if(err) return res.json(err);
		else res.redirect('/account');
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
	Account.findOne({userid: req.params.userid}, function(err, userData) {
		if(err) res.json(err);
		else res.render('account/edit', {userData:userData});
	});
});

// Update
router.put('/:userid', function(req, res, next) {
	Account.findOne({userid: req.params.userid})
	.select('password')
	.exec(function(err, userData) {
		if(err) res.json(err);

		userData.originalPassword = userData.password;
		userData.password = req.body.newPassword ? req.body.newPassword : userData.password;

		for(let p in req.body) {
			userData[p] = req.body[p];
		}

		userData.save(function(err, userData) {
			if(err) res.json(err);
			else res.redirect('/account/' + req.params.userid);
		});
	});
});

module.exports = router;
