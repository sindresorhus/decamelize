import test from 'ava';
import fn from './';

test(t => {
	t.is(fn(''), '');
	t.is(fn('unicornsAndRainbows'), 'unicorns_and_rainbows');
	t.is(fn('UNICORNS AND RAINBOWS'), 'unicorns and rainbows');
	t.is(fn('unicorns-and-rainbows'), 'unicorns-and-rainbows');
	t.is(fn('thisIsATest'), 'this_is_a_test');
	t.is(fn('thisIsATest', ' '), 'this is a test');
	t.is(fn('thisIsATest', ''), 'thisisatest');
	t.is(fn('unicornRainbow', '|'), 'unicorn|rainbow');
	t.is(fn('myURLString', '_'), 'my_url_string');
	t.is(fn('URLString', '_'), 'url_string');
	t.is(fn('StringURL', '_'), 'string_url');
});
