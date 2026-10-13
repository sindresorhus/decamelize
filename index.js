// An uppercase or titlecase letter, with the characters before and after it. A combining mark belongs to the letter before it, which matters for decomposed (NFD) text, so marks are skipped.
// Unicode casing properties also include characters outside the letter categories, such as Roman numerals and circled letters.
// A Unicode decimal digit counts as lowercase before the letter, and as uppercase after it: `O2Level` → `O2_Level`.
// An `s` after the letter at the end of a word makes it a plural acronym, not a new word: `userIDs` → `user_ids`, not `user_i_ds`. Before another word, it is more often a word like `Is` (`userIDIsValid`), so it is split there. A digit continues a word, like in `mp3Player`.
// Everything is decided on the original text in one pass, as a separator inserted earlier would hide where a word ends.
// The leading lookahead makes the lookbehind only run before an uppercase or titlecase letter, which keeps it linear.
// The lookbehind and the trailing lookahead only capture the characters around the letter, so they can match nothing.
// eslint-disable-next-line regexp/no-useless-assertions, regexp/no-empty-lookarounds-assertion, regexp/prefer-named-capture-group
const uppercaseLetter = /(?=[\p{Titlecase_Letter}\p{Uppercase}])(?<=(?:([\p{Decimal_Number}\p{Lowercase}])|([\p{Titlecase_Letter}\p{Uppercase}]))?\p{Mark}*)[\p{Titlecase_Letter}\p{Uppercase}](?=\p{Mark}*(?:s(?![\p{Decimal_Number}\p{Letter}\p{Mark}\p{Lowercase}\p{Uppercase}])|(\p{Lowercase})|([\p{Decimal_Number}\p{Titlecase_Letter}\p{Uppercase}]))?)/gv;

export default function decamelize(
	text,
	{
		separator = '_',
		preserveConsecutiveUppercase = false,
	} = {},
) {
	if (!(typeof text === 'string' && typeof separator === 'string')) {
		throw new TypeError(
			'The `text` and `separator` arguments should be of type `string`',
		);
	}

	// A single Unicode character with attached combining marks is still one letter, including astral and decomposed text.
	if (text.length < 2 || /^.\p{Mark}*$/sv.test(text)) {
		return preserveConsecutiveUppercase ? text : text.toLowerCase();
	}

	const words = [];
	let wordStart = 0;
	// eslint-disable-next-line max-params
	const decamelized = text.replaceAll(uppercaseLetter, (letter, afterLowercase, afterUppercase, beforeLowercase, beforeUppercase, offset) => {
		// Split lowercase sequences followed by uppercase character.
		// `dataForUSACounties` → `data_For_USACounties`
		// `myURLstring → `my_URLstring`
		// Split multiple uppercase characters followed by one or more lowercase characters.
		// `my_URLstring` → `my_ur_lstring`
		const isWordStart = afterLowercase !== undefined || (afterUppercase !== undefined && beforeLowercase !== undefined);

		if (!preserveConsecutiveUppercase) {
			if (isWordStart) {
				words.push(text.slice(wordStart, offset).toLowerCase());
				wordStart = offset;
			}

			return letter;
		}

		// Lowercase all single uppercase characters. As we
		// want to preserve uppercase sequences, we cannot
		// simply lowercase the separated string at the end.
		// `data_For_USACounties` → `data_for_USACounties`
		// Remaining uppercase sequences will be separated from lowercase sequences.
		// `data_For_USACounties` → `data_for_USA_counties`
		const prefix = isWordStart ? separator : '';
		const isInUppercaseSequence = afterUppercase === undefined ? beforeUppercase !== undefined : beforeLowercase === undefined;
		return prefix + (isInUppercaseSequence ? letter : letter.toLowerCase());
	});

	if (preserveConsecutiveUppercase) {
		return decamelized;
	}

	// Lowercase each word before inserting the separator, preserving the separator and word-local casing such as Greek final sigma.
	words.push(text.slice(wordStart).toLowerCase());
	return words.join(separator);
}
