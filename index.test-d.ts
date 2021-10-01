import {expectType} from 'tsd';
import decamelize from './index.js';

expectType<string>(decamelize('unicornRainbow'));
expectType<string>(decamelize('unicornRainbow', {separator: '-'}));
expectType<string>(decamelize('unicornRainbow', {
	separator: '-',
	preserveConsecutiveUppercase: true,
}));
