import test from 'ava';
import m from '.';

test(t => {
	t.is(m(''), '');
	t.is(m('unicornsAndRainbows'), 'unicorns_and_rainbows');
	t.is(m('UNICORNS AND RAINBOWS'), 'unicorns and rainbows');
	t.is(m('unicorns-and-rainbows'), 'unicorns-and-rainbows');
	t.is(m('thisIsATest'), 'this_is_a_test');
	t.is(m('thisIsATest', ' '), 'this is a test');
	t.is(m('thisIsATest', ''), 'thisisatest');
	t.is(m('unicornRainbow', '|'), 'unicorn|rainbow');
	t.is(m('myURLString', '_'), 'my_url_string');
	t.is(m('URLString', '_'), 'url_string');
	t.is(m('StringURL', '_'), 'string_url');
	t.is(m('thisHasSpecialCharactersLikeČandŠ', ' '), 'this has special characters like čand š');
});
