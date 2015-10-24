'use strict';
module.exports = function (str, sep) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}
	sep = sep || '_';
	var regex1 = new RegExp("([a-z\d])([A-Z])", "g");
	var regex2 = new RegExp("(" + sep + "[A-Z])([A-Z])", "g");
	return str.replace(regex1, '$1' + sep + '$2')
					.replace(regex2, '$1' + sep + '$2')
					.toLowerCase();
};
