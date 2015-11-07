import test from 'ava';
import fn from './';

test(function (t) {
	t.is(fn(''), '');
	t.is(fn('unicornsAndRainbows'), 'unicorns_and_rainbows');
	t.is(fn('UNICORNS AND RAINBOWS'), 'unicorns and rainbows');
	t.is(fn('unicorns-and-rainbows'), 'unicorns-and-rainbows');
	t.is(fn('thisIsATest'), 'this_is_a_test');
	t.is(fn('thisIsATest', ' '), 'this is a test');
	t.is(fn('thisIsATest', ''), 'thisisatest');
	t.end();
});
