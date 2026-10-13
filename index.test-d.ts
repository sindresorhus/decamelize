import {expectError, expectTypeOf} from 'nz';
import decamelize, {type Options} from './index.js';

expectTypeOf(decamelize('unicornRainbow')).toBe<string>();
expectTypeOf(decamelize('unicornRainbow', {separator: '-'})).toBe<string>();
expectTypeOf(decamelize('unicornRainbow', {
	separator: '-',
	preserveConsecutiveUppercase: true,
})).toBe<string>();

const options: Options = {separator: '|', preserveConsecutiveUppercase: true};
expectTypeOf(decamelize('getURLValue', options)).toBe<string>();
expectError(options.separator = '-');
expectError(options.preserveConsecutiveUppercase = false);
expectError(decamelize(42));
expectError(decamelize('fooBar', {separator: 42}));
expectError(decamelize('fooBar', {preserveConsecutiveUppercase: 'true'}));
expectError(decamelize('fooBar', {unknownOption: true}));
