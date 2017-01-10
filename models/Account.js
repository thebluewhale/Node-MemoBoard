var mongoose = require('mongoose');

const Account = mongoose.Schema({
	userid: {type:String, required:true, unique:true},
	password: {type:String, required:true, select:false},
	username: {type:String, required:true},
	email: {type:String}
}, {
	toObject:{virtuals:true}
});

Account.virtual('passwordConfirmation')
.get(function() { return this._passwordConfirmation; })
.set(function(value) { this._passwordConfirmation=value; });

Account.virtual('originalPassword')
.get(function() { return this._originalPassword; })
.set(function(value) { this._originalPassword=value; });

Account.virtual('currentPassword')
.get(function() { return this._currentPassword; })
.set(function(value) { this._currentPassword=value; });

Account.virtual('newPassword')
.get(function() { return this._newPassword; })
.set(function(value) { this._newPassword=value; });

Account.path('password').validate(function(v) {
	let user = this;

	if(user.isNew) {
		if(!user.passwordConfirmation) {
			user.invalidate('passwordConfirmation', 'password confirmation is required');
		}
		if(user.password !== user.passwordConfirmation) {
			user.invalidate('passwordConfirmation', 'password confirmation is not matched');
		}
	} else if(!user.isNew) {
		if(!user.currentPassword) {
			user.invalidate('currentPassword', 'current password is required');
		}
		if(user.currentPassword && (user.currentPassword != user.originalPassword)) {
			user.invalidate('currentPassword', 'current password is invalid');
		}
		if(user.newPassword !== user.passwordConfirmation) {
			user.invalidate('passwordConfirmation', 'password confirmation is not matched');
		}
	}
});

const _Account = mongoose.model('account', Account);
module.exports = _Account;
