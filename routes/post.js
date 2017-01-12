var express = require('express');
var router = express.Router();
var Post = require('../models/Post');

router.get('/', function(req, res) {
	Post.find({})
	.sort('-createdAt')
	.exec(function(err, posts) {
		if(err) return res.json(err);
		else res.render('post/index', {posts:posts});
	});
});

// New
router.get('/new', function(req, res) {
	res.render('post/new');
});

// create
router.post('/', function(req, res) {
	Post.create(req.body, function(err, posts) {
		if(err) res.json(err);
		else res.redirect('/posts');
	});
});

// Show
router.get('/:id', function(req, res) {
	Post.findOne({_id:req.params.id}, function(err, posts) {
		if(err) res.json(err);
		else res.render('post/show', {posts:posts});
	});
});

// Edit
router.get('/:id/edit', function(req, res) {
	Post.findOne({_id:req.params.id}, function(err, posts) {
		if(err) res.json(err);
		else res.render('post/edit', {posts:posts});
	});
});

// Update
router.put('/:id', function(req, res) {
	req.body.updatedAt = Date.now();
	Post.findOne({_id:req.params.id}, req.body, function(err, posts) {
		if(err) res.json(err);
		else res.redirect('/posts/' + req.params.id);
	});
});

// Delete
router.delete('/:id', function(req, res) {
	Post.remove({_id:req.params.id}, function(err) {
		if(err) res.json(err);
		else res.redirect('/posts');
	});
});

module.exports = router;
