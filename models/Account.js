var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const accountSchema = mongoose.Schema({
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

accountSchema.virtual('passwordConfirmation')
.get(function() { return this._passwordConfirmation; })
.set(function(value) { this._passwordConfirmation=value; });

accountSchema.virtual('originalPassword')
.get(function() { return this._originalPassword; })
.set(function(value) { this._originalPassword=value; });

accountSchema.virtual('currentPassword')
.get(function() { return this._currentPassword; })
.set(function(value) { this._currentPassword=value; });

accountSchema.virtual('newPassword')
.get(function() { return this._newPassword; })
.set(function(value) { this._newPassword=value; });

accountSchema.pre('save', function(next) {
	let userData = this;
	if(!userData.isModified('password')) {
		return next();
	} else {
		userData.password = bcrypt.hashSync(userData.password);
		return next();
	}
});

accountSchema.methods.authenticate = function(password) {
	let userData = this;
	return bcrypt.compareSync(password, userData.password);
}

accountSchema.path('password').validate(function(v) {
	let passwordRegex = /^.{8,16}$/;
	let passwordRegexError = '8-16 length available';
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
		} else if(userData.newPassword && !passwordRegex.test(userData.newPassword)) {
			userData.invalidate('newPassword', passwordRegexError);
		} else if(userData.newPassword && (userData.newPassword !== userData.passwordConfirmation)) {
			userData.invalidate('passwordConfirmation', 'password confirmation is not matched');
		}
	}
});

const Account = mongoose.model('account', accountSchema);
module.exports = Account;
