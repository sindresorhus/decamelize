const handlePreserveConsecutiveUppercase = (decamelized, separator) => {
	// Lowercase all single uppercase characters. As we
	// want to preserve uppercase sequences, we cannot
	// simply lowercase the separated string at the end.
	// `data_For_USACounties` → `data_for_USACounties`
	decamelized = decamelized.replace(
		/((?<![\p{Uppercase_Letter}\d])[\p{Uppercase_Letter}\d](?![\p{Uppercase_Letter}\d]))/gu,
		$0 => $0.toLowerCase(),
	);

	// Remaining uppercase sequences will be separated from lowercase sequences.
	// `data_For_USACounties` → `data_for_USA_counties`
	// We anchor at the start of an uppercase run to avoid excessive backtracking on
	// long all-uppercase substrings followed by a non-lowercase character.
	return decamelized.replace(
		/(?<![\p{Uppercase_Letter}])(\p{Uppercase_Letter}+)(\p{Uppercase_Letter}\p{Lowercase_Letter}+)/gu,
		(_, $1, $2) => $1 + separator + $2.toLowerCase(),
	);
};

export default function decamelize(
	text,
	{
		separator = '_',
		preserveConsecutiveUppercase = false,
		separateDigits = false,
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

	const replacement = `$1${separator}$2`;

	// Split lowercase sequences followed by uppercase character.
	// `dataForUSACounties` → `data_For_USACounties`
	// `myURLstring → `my_URLstring`
	const decamelized = text.replace(
		/([\p{Lowercase_Letter}\d])(\p{Uppercase_Letter})/gu,
		replacement,
	);

	let result;
	if (preserveConsecutiveUppercase) {
		result = handlePreserveConsecutiveUppercase(decamelized, separator);
	} else {
		// Split multiple uppercase characters followed by one or more lowercase characters.
		// `my_URLstring` → `my_ur_lstring`
		result = decamelized
			.replace(
				/(\p{Uppercase_Letter})(\p{Uppercase_Letter}\p{Lowercase_Letter}+)/gu,
				replacement,
			)
			.toLowerCase();
	}

	// Optionally split letter/digit boundaries so that identifiers such as
	// `foo2bar` become `foo_2_bar`. Only letter↔digit boundaries are touched, so
	// any existing separators are preserved.
	if (separateDigits) {
		result = result
			.replace(/([\p{Letter}])([\d])/gu, `$1${separator}$2`)
			.replace(/([\d])([\p{Letter}])/gu, `$1${separator}$2`);
	}

	return result;
}
