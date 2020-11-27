# decamelize [![Build Status](https://travis-ci.org/sindresorhus/decamelize.svg?branch=master)](https://travis-ci.org/sindresorhus/decamelize)

> Convert a camelized string into a lowercased one with a custom separator<br>
> Example: `unicornRainbow` → `unicorn_rainbow`

## Install

```
$ npm install decamelize
```

## Usage

```js
const decamelize = require('decamelize');

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

##### preserveConsecutiveUppercase

Type: `boolean`\
Default: `false`

Set to `true` to preserve sequences of uppercase characters: `testGUILabel`→`test_gui_label`.

## Related

See [`camelcase`](https://github.com/sindresorhus/camelcase) for the inverse.

---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-decamelize?utm_source=npm-decamelize&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
