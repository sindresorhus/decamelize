import test from 'ava';
import decamelize from '.';

test('decamelize', t => {
	t.is(decamelize(''), '');
	t.is(decamelize('A'), 'a');
	t.is(decamelize('A B'), 'a b');
	t.is(decamelize('a2b'), 'a2b');
	t.is(decamelize('A2B'), 'a2_b');
	t.is(decamelize('_A2B'), '_a2_b');
	t.is(decamelize('myURLstring'), 'my_ur_lstring');
	t.is(decamelize('unicornsAndRainbows'), 'unicorns_and_rainbows');
	t.is(decamelize('UNICORNS AND RAINBOWS'), 'unicorns and rainbows');
	t.is(decamelize('unicorns-and-rainbows'), 'unicorns-and-rainbows');
	t.is(decamelize('thisIsATest'), 'this_is_a_test');
	t.is(decamelize('thisIsATest', ' '), 'this is a test');
	t.is(decamelize('thisIsATest', ''), 'thisisatest');
	t.is(decamelize('unicornRainbow', '|'), 'unicorn|rainbow');
	t.is(decamelize('thisHasSpecialCharactersLikeČandŠ', ' '), 'this has special characters like čand š');
});

test('handles acronyms', t => {
	t.is(decamelize('myURLString'), 'my_url_string');
	t.is(decamelize('URLString'), 'url_string');
	t.is(decamelize('StringURL'), 'string_url');
	t.is(decamelize('testGUILabel'), 'test_gui_label');
	t.is(decamelize('CAPLOCKED1'), 'caplocked1');
});

test('separator in string', t => {
	t.is(decamelize('my_URL_string', '_'), 'my_url_string');
});

