import {expectType} from 'tsd';
import decamelize = require('.');

expectType<string>(decamelize('unicornRainbow'));
expectType<string>(decamelize('unicornRainbow', '-'));
