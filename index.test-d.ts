import {expectType} from 'tsd-check';
import decamelize from '.';

expectType<string>(decamelize('unicornRainbow'));
expectType<string>(decamelize('unicornRainbow', '-'));
