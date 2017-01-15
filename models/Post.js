var mongoose = require('mongoose');
var common = require('../utils/common');

const postSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Title is required']
	},
	content: {
		type: String,
		required: [true, 'Contents is required']
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "account",
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
}, {
	toObject: {virtuals: true}
});

postSchema.virtual('createdDate').get(function() {
	return common.getDate(this.createdAt);
});

postSchema.virtual('createdTime').get(function() {
	return common.getTime(this.createdAt);
});

postSchema.virtual('updatedDate').get(function() {
	return common.getDate(this.updatedAt);
});

postSchema.virtual('updatedTime').get(function() {
	return common.getTime(this.updatedAt);
});

var Post = mongoose.model('post', postSchema);

module.exports = Post;
