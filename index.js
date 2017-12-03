'use strict';
module.exports = (text, separator) => {
	if (typeof text !== 'string') {
		throw new TypeError('Expected a string');
	}

	separator = typeof separator === 'undefined' ? '_' : separator;

	return text
		.replace(/([a-z\d])([A-Z])/g, `$1${separator}$2`)
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, `$1${separator}$2`)
		.toLowerCase();
};
