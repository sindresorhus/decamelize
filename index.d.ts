export type Options = {
	/**
	The character or string used to separate words.

	@default '_'

	@example
	```
	import decamelize from 'decamelize';

	decamelize('unicornRainbow');
	//=> 'unicorn_rainbow'

	decamelize('unicornRainbow', {separator: '-'});
	//=> 'unicorn-rainbow'
	```
	*/
	readonly separator?: string;

	/**
	Preserve sequences of uppercase characters.

	@default false

	@example
	```
	import decamelize from 'decamelize';

	decamelize('testGUILabel');
	//=> 'test_gui_label'

	decamelize('testGUILabel', {preserveConsecutiveUppercase: true});
	//=> 'test_GUI_label'
	```
	*/
	readonly preserveConsecutiveUppercase?: boolean;
};

/**
Convert a camelized string into a lowercased one with a custom separator: `unicornRainbow` → `unicorn_rainbow`.

@param string - The camelcase string to decamelize.

@example
```
import decamelize from 'decamelize';

decamelize('unicornRainbow');
//=> 'unicorn_rainbow'

decamelize('unicornRainbow', {separator: '-'});
//=> 'unicorn-rainbow'
```
*/
export default function decamelize(string: string, options?: Options): string;
