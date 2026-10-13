// An uppercase letter that starts a capitalized word after another uppercase letter: the `S` in `URLString`.
// A combining mark belongs to the letter before it, which matters for decomposed (NFD) text.
// Each lookbehind is preceded by a lookahead, so it only runs before an uppercase letter, which keeps it linear.
const uppercaseWordStart = /(?=\p{Uppercase_Letter})(?<=\p{Uppercase_Letter}\p{Mark}*)\p{Uppercase_Letter}(?=\p{Mark}*\p{Lowercase_Letter})/gu;

const handlePreserveConsecutiveUppercase = (decamelized, separator) => {
	// Lowercase all single uppercase characters. As we
	// want to preserve uppercase sequences, we cannot
	// simply lowercase the separated string at the end.
	// `data_For_USACounties` → `data_for_USACounties`
	// A combining mark belongs to the letter before it, so `É` in decomposed (NFD) text is still part of `ÉTAT`.
	decamelized = decamelized.replace(
		/(?=[\p{Uppercase_Letter}\d])(?<![\p{Uppercase_Letter}\d]\p{Mark}*)[\p{Uppercase_Letter}\d](?!\p{Mark}*[\p{Uppercase_Letter}\d])/gu,
		$0 => $0.toLowerCase(),
	);

	// Remaining uppercase sequences will be separated from lowercase sequences.
	// `data_For_USACounties` → `data_for_USA_counties`
	return decamelized.replace(
		uppercaseWordStart,
		letter => separator + letter.toLowerCase(),
	);
};

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

	// Checking the second character is done later on. Therefore process shorter strings here.
	if (text.length < 2) {
		return preserveConsecutiveUppercase ? text : text.toLowerCase();
	}

	// Split lowercase sequences followed by uppercase character.
	// `dataForUSACounties` → `data_For_USACounties`
	// `myURLstring → `my_URLstring`
	const decamelized = text.replace(
		/(?=\p{Uppercase_Letter})(?<=[\p{Lowercase_Letter}\d]\p{Mark}*)/gu,
		() => separator,
	);

	if (preserveConsecutiveUppercase) {
		return handlePreserveConsecutiveUppercase(decamelized, separator);
	}

	// Split multiple uppercase characters followed by one or more lowercase characters.
	// `my_URLstring` → `my_ur_lstring`
	return decamelized
		.replace(uppercaseWordStart, letter => separator + letter)
		.toLowerCase();
}
