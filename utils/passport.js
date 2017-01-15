var passport = require('passport');
var localStratergy = require('passport-local');
var Account = require('../models/Account');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	Account.findOne({_id: id}, function(err, account) {
		done(err, account);
	});
});

passport.use('local-login',
	new localStratergy({
		usernameField: 'userid',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, userid, password, done) {
		Account.findOne({userid: userid})
		.select({password: 1})
		.exec(function(err, account) {
			if(err) return done(err);

			if(account && account.authenticate(password)) {
				return done(null, account);
			} else {
				req.flash('errors', {login: 'invalid ID or password'});
				return done(null, false);
			}
		});
	}
));

module.exports = passport;
