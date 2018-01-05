'use strict';

const xRegExp = require('xregexp');

module.exports = (text, separator) => {
	if (typeof text !== 'string') {
		throw new TypeError('Expected a string');
	}

	separator = typeof separator === 'undefined' ? '_' : separator;

	// Create 2 regex that support unicode characters
	const regex1 = xRegExp('([\\p{Ll}\\d])(\\p{Lu})', 'g');
	const regex2 = xRegExp('(\\p{Lu}+)(\\p{Lu}[\\p{Ll}\\d]+)', 'g');

	return text
		.replace(regex1, `$1${separator}$2`)
		.replace(regex2, `$1${separator}$2`)
		.toLowerCase();
};
