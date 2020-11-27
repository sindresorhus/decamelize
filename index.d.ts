declare namespace decamelize {
	interface Options {
		/**
		Set to true to preserve sequences of uppercase characters.

		decamelize('testGUILabel', {preserveConsecutiveUppercase: true}) → `test_GUI_label`
		decamelize('testGUILabel', {preserveConsecutiveUppercase: false}) → `test_gui_label`
		@default false
		*/
		readonly preserveConsecutiveUppercase?: boolean;

		/**
		 The separator to use to put in between the words from `string`.
		@default '_'
		*/
		readonly separator?: string;
	}
}

/**
Convert a camelized string into a lowercased one with a custom separator: `unicornRainbow` → `unicorn_rainbow`.

@param string - The camelcase string to decamelize.

@example
```
import decamelize = require('decamelize');

decamelize('unicornRainbow');
//=> 'unicorn_rainbow'

decamelize('unicornRainbow', { separator: '-' });
//=> 'unicorn-rainbow'
```
*/
declare function decamelize(string: string, options?: decamelize.Options): string;

export = decamelize;
