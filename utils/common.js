var common = {};

common.parseError = function(err) {
	let parsed = {};
	if(err.name == 'ValidationError') {
		for(let name in err.errors) {
			let validationError = err.errors[name];
			if(name == 'userid') {
				parsed[name] = { message: 'User ID is required' }
			} else if(name == 'username') {
				parsed[name] = { message: 'User Name is required' }
			} else if(name == 'email') {
				parsed[name] = { message: 'Emain Address is required' }
			} else if(name == 'password') {
				parsed[name] = { message: 'Password is required' }
			} else if(name == 'passwordConfirmation') {
				parsed[name] = { message: 'Password Confimation is required' }
			} else {
				parsed[name] = { message: validationError.message.replace('Path ', 'Error : ') }
			}
		}
	} else if(err.code == '11000' && err.errmsg.indexOf('userid') > 0) {
		parsed.userid = { message: 'This User ID already exists' };
	} else {
		parsed.unhandled = JSON.stringify(err);
	}
	return parsed;
}

common.getDate = function(dateObj) {
	if(dateObj instanceof Date)
		return dateObj.getFullYear() + '-' + get2digits(dateObj.getMonth()+1) + '-' + get2digits(dateObj.getDate());
}

common.getTime = function(dateObj) {
	if(dateObj instanceof Date)
		return get2digits(dateObj.getHours()) + ':' + get2digits(dateObj.getMinutes()) + ':' + get2digits(dateObj.getSeconds());
}

common.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		next();
	} else {
		req.flash('errors', {login: 'You should log in first'});
		res.redirect('/login');
	}
}

common.noPermission = function(req, res) {
	req.flash('errors', {login: 'You have no permission'});
	//req.logout();
	req.redirect('/');
}

module.exports = common;

function get2digits(num) {
	return ('0' + num).slice(-2);
}
