import test from 'ava';
import decamelize from '.';

test('decamelize', t => {
	t.is(decamelize(''), '');
	t.is(decamelize('unicornsAndRainbows'), 'unicorns_and_rainbows');
	t.is(decamelize('UNICORNS AND RAINBOWS'), 'unicorns and rainbows');
	t.is(decamelize('unicorns-and-rainbows'), 'unicorns-and-rainbows');
	t.is(decamelize('thisIsATest'), 'this_is_a_test');
	t.is(decamelize('thisIsATest', ' '), 'this is a test');
	t.is(decamelize('thisIsATest', ''), 'thisisatest');
	t.is(decamelize('unicornRainbow', '|'), 'unicorn|rainbow');
	t.is(decamelize('myURLString', '_'), 'my_url_string');
	t.is(decamelize('URLString', '_'), 'url_string');
	t.is(decamelize('StringURL', '_'), 'string_url');
	t.is(decamelize('thisHasSpecialCharactersLikeČandŠ', ' '), 'this has special characters like čand š');
});
