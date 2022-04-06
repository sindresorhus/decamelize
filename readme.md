# decamelize

> Convert a camelized string into a lowercased one with a custom separator\
> Example: `unicornRainbow` → `unicorn_rainbow`

If you use this on untrusted user input, don't forget to limit the length to something reasonable.

## Install

```sh
npm install decamelize
```

*If you need Safari support, [stay on](https://github.com/sindresorhus/decamelize/issues/24) [version 3](https://github.com/sindresorhus/decamelize/issues/36) [until they implement](https://caniuse.com/js-regexp-lookbehind) regex lookbehinds.*

## Usage

```js
import decamelize from 'decamelize';

decamelize('unicornRainbow');
//=> 'unicorn_rainbow'

decamelize('unicornRainbow', {separator: '-'});
//=> 'unicorn-rainbow'

decamelize('testGUILabel', {preserveConsecutiveUppercase: true});
//=> 'test_GUI_label'

decamelize('testGUILabel', {preserveConsecutiveUppercase: false});
//=> 'test_gui_label'
```

## API

### decamelize(input, options?)

#### input

Type: `string`

#### options

Type: `object`

##### separator

Type: `string`\
Default: `'_'`

The character or string used to separate words.

```js
import decamelize from 'decamelize';

decamelize('unicornRainbow');
//=> 'unicorn_rainbow'

decamelize('unicornRainbow', {separator: '-'});
//=> 'unicorn-rainbow'
```

##### preserveConsecutiveUppercase

Type: `boolean`\
Default: `false`

Preserve sequences of uppercase characters.

```js
import decamelize from 'decamelize';

decamelize('testGUILabel');
//=> 'test_gui_label'

decamelize('testGUILabel', {preserveConsecutiveUppercase: true});
//=> 'test_GUI_label'
```

## Related

- [camelcase](https://github.com/sindresorhus/camelcase) - The inverse of this package
- [decamelize-keys](https://github.com/sindresorhus/decamelize-keys) - Convert object keys from camel case
