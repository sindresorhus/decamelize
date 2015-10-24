'use strict';
var test = require('ava');
var decamelize = require('./');

test(function (t) {
	t.assert(decamelize('') === '');
	t.assert(decamelize('unicornsAndRainbows') === 'unicorns_and_rainbows');
	t.assert(decamelize('UNICORNS AND RAINBOWS') === 'unicorns and rainbows');
	t.assert(decamelize('unicorns-and-rainbows') === 'unicorns-and-rainbows');
	t.assert(decamelize('thisIsATest') === 'this_is_a_test');
	t.assert(decamelize('thisIsATest', ' ') === 'this is a test');
	t.end();
});
