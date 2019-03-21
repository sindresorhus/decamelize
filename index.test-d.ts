import {expectType} from 'tsd';
import decamelize from '.';

expectType<string>(decamelize('unicornRainbow'));
expectType<string>(decamelize('unicornRainbow', '-'));
