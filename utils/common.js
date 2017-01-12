var common = {};

common.parseError = function(err) {
	let parsed = {};
	if(err.name == 'ValidationError') {
		for(let name in err.errors) {
			let validationError = err.errors[name];
			parsed[name] = { message: validationError.message };
		}
	} else if(err.code == '11000' && err.errmsg.indexOf('userid') > 0) {
		parsed.username = { message: 'this user name already exists' };
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

module.exports = common;

function get2digits(num) {
	return ('0' + num).slice(-2);
}
