var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var utils = require('../utils/common');

router.get('/', function(req, res) {
	Post.find({})
	.populate('author')
	.sort('-createdAt')
	.exec(function(err, posts) {
		if(err) return res.json(err);
		else res.render('post/index', {posts:posts});
	});
});

// Write
router.get('/write', utils.isLoggedIn, function(req, res) {
	res.render('post/write');
});

// create
router.post('/', utils.isLoggedIn, function(req, res) {
	req.body.author = req.user._id;
	Post.create(req.body, function(err, posts) {
		if(err) {
			req.flash('posts', req.body);
			req.flash('errors', utils.parseError(err));
			console.log(err);
			res.redirect('/posts/write');
		}
		else res.redirect('/posts');
	});
});

// Show
router.get('/:id', function(req, res) {
	Post.findOne({_id:req.params.id})
		.populate('author')
		.exec(function(err, posts) {
		if(err) res.json(err);
		else res.render('post/show', {posts:posts});
	});
});

// Edit
router.get('/:id/edit', utils.isLoggedIn, checkPermission, function(req, res) {
	Post.findOne({_id:req.params.id}, function(err, posts) {
		if(err) res.json(err);
		else res.render('post/edit', {posts:posts});
	});
});

// Update
router.put('/:id', utils.isLoggedIn, checkPermission, function(req, res) {
	Post.findOne({_id:req.params.id})
	.exec(function(err, post) {
		if(err) res.json(err);

		for(let param in req.body) {
			post[param] = req.body[param];
		}

		post.save(function(err, post) {
			if(err) res.json(err);
			//else res.redirect('/posts/' + req.params.id);
			else res.redirect('/posts/');
		});
	});
});

// Delete
router.delete('/:id', utils.isLoggedIn, checkPermission, function(req, res) {
	Post.remove({_id:req.params.id}, function(err) {
		if(err) res.json(err);
		else res.redirect('/posts');
	});
});

module.exports = router;

function checkPermission(req, res, next) {
	Post.findOne({_id: req.params.id}, function(err, posts) {
		if(err) {
			return res.json(err);
		} else if(posts.author != req.user.id) {
			return utils.noPermission(req, res);
		} else {
			next();
		}
	});
}
