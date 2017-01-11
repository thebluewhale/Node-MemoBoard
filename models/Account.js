var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const Account = mongoose.Schema({
	userid: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		match: [/^.{4,12}$/, '4-12 length available']
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	username: {
		type: String,
		required: true,
		trim: true,
		match: [/^.{3,12}$/, '3-12 length available']
	},
	email: {
		type: String,
		trim: true,
		match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[a-zA-Z]{2,}$/, 'full email adress available']
	}
}, {
	toObject:{
		virtuals:true
	}
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

Account.pre('save', function(next) {
	let userData = this;
	if(!userData.isModified('password')) {
		return next();
	} else {
		userData.password = bcrypt.hashSync(userData.password);
		return next();
	}
});

Account.methods.authenticate = function(password) {
	let userData = this;
	return bcrypt.compareSync(password, userData.password);
}

Account.path('password').validate(function(v) {
	let passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
	let passwordRegexError = '8-12 length available';
	let userData = this;

	if(userData.isNew) {
		if(!userData.passwordConfirmation) {
			userData.invalidate('passwordConfirmation', 'password confirmation is required');
		} else if(userData.password !== userData.passwordConfirmation) {
			userData.invalidate('passwordConfirmation', 'password confirmation is not matched');
		} else if(!passwordRegex.test(userData.password)) {
			userData.invalidate('password', passwordRegexError);
		}
	} else if(!userData.isNew) {
		if(!userData.currentPassword) {
			userData.invalidate('currentPassword', 'current password is required');
		} else if(userData.currentPassword &&
			!(bcrypt.compareSync(userData.currentPassword, userData.originalPassword))) {
			userData.invalidate('currentPassword', 'current password is invalid');
		} else if(userData.newPassword !== userData.passwordConfirmation) {
			userData.invalidate('passwordConfirmation', 'password confirmation is not matched');
		} else if(!passwordRegex.test(userData.password)) {
			userData.invalidate('newPassword', passwordRegexError);
		}
	}
});

const _Account = mongoose.model('account', Account);
module.exports = _Account;
