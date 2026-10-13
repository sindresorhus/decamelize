import process from 'node:process';
import assert from 'node:assert/strict';
import test from 'node:test';
import decamelize from './index.js';

const measureMs = fn => {
	const start = process.hrtime.bigint();
	fn();
	const end = process.hrtime.bigint();
	return Number(end - start) / 1e6;
};

test('decamelize', () => {
	assert.equal(decamelize(''), '');
	assert.equal(decamelize('A'), 'a');
	assert.equal(decamelize('A B'), 'a b');
	assert.equal(decamelize('a2b'), 'a2b');
	assert.equal(decamelize('A2B'), 'a2_b');
	assert.equal(decamelize('_A2B'), '_a2_b');
	assert.equal(decamelize('myURLstring'), 'my_ur_lstring');
	assert.equal(decamelize('unicornsAndRainbows'), 'unicorns_and_rainbows');
	assert.equal(decamelize('UNICORNS AND RAINBOWS'), 'unicorns and rainbows');
	assert.equal(decamelize('unicorns-and-rainbows'), 'unicorns-and-rainbows');
	assert.equal(decamelize('thisIsATest'), 'this_is_a_test');
	assert.equal(decamelize('thisIsATest', {separator: ' '}), 'this is a test');
	assert.equal(decamelize('thisIsATest', {separator: ''}), 'thisisatest');
	assert.equal(decamelize('unicornRainbow', {separator: '|'}), 'unicorn|rainbow');
	assert.equal(decamelize('unicornRainbow', {separator: '-'}), 'unicorn-rainbow');
	assert.equal(
		decamelize('thisHasSpecialCharactersLikeČandŠ', {separator: ' '}),
		'this has special characters like čand š',
	);
});

test('handles acronyms', () => {
	assert.equal(decamelize('myURLString'), 'my_url_string');
	assert.equal(decamelize('URLString'), 'url_string');
	assert.equal(decamelize('StringURL'), 'string_url');
	assert.equal(decamelize('testGUILabel'), 'test_gui_label');
	assert.equal(decamelize('CAPLOCKED1'), 'caplocked1');
});

test('separator in string', () => {
	assert.equal(decamelize('my_URL_string'), 'my_url_string');
});

test('separator with replacement patterns is inserted literally', () => {
	assert.equal(decamelize('helloWorld', {separator: '$&'}), 'hello$&world');
	assert.equal(decamelize('myURLString', {separator: '$1'}), 'my$1url$1string');
	assert.equal(
		decamelize('testGUILabel', {
			separator: '$$',
			preserveConsecutiveUppercase: true,
		}),
		'test$$GUI$$label',
	);
});

test('separator and options passed', () => {
	assert.equal(
		decamelize('testGUILabel', {
			separator: '!',
			preserveConsecutiveUppercase: true,
		}),
		'test!GUI!label',
	);
});

test('keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow', () => {
	assert.equal(
		decamelize('A', {
			preserveConsecutiveUppercase: true,
		}),
		'A',
	);
	assert.equal(
		decamelize('myURLString', {
			preserveConsecutiveUppercase: true,
		}),
		'my_URL_string',
	);
	assert.equal(
		decamelize('URLString', {
			preserveConsecutiveUppercase: true,
		}),
		'URL_string',
	);
	assert.equal(
		decamelize('oxygenO2Level', {
			preserveConsecutiveUppercase: true,
		}),
		'oxygen_O2_level',
	);
	assert.equal(
		decamelize('StringURL', {
			preserveConsecutiveUppercase: true,
		}),
		'string_URL',
	);
	assert.equal(
		decamelize('STringURL', {
			preserveConsecutiveUppercase: true,
		}),
		'S_tring_URL',
	);
	assert.equal(
		decamelize('numberOfDataForUSA', {
			preserveConsecutiveUppercase: true,
		}),
		'number_of_data_for_USA',
	);
	assert.equal(
		decamelize('testGUILabel', {
			preserveConsecutiveUppercase: true,
		}),
		'test_GUI_label',
	);
	assert.equal(
		decamelize('CAPLOCKED1', {
			preserveConsecutiveUppercase: true,
		}),
		'CAPLOCKED1',
	);
	/// assert.equal(
	// 	decamelize('aBC', {
	// 		preserveConsecutiveUppercase: true,
	// 	}),
	// 	'a_b_c',
	// );
});

test('splits words with decomposed accents', () => {
	// Decomposed (NFD) text, common in macOS file names, puts a combining mark after the base letter, which hid the word boundary.
	assert.equal(decamelize('cafe\u{301}Menu'), 'cafe\u{301}_menu');
	assert.equal(decamelize('nai\u{308}veApproach'), 'nai\u{308}ve_approach');
	assert.equal(decamelize('pho\u{302}\u{301}Bar'), 'pho\u{302}\u{301}_bar'); // Several marks
	assert.equal(decamelize('XMLE\u{301}cole'), 'xml_e\u{301}cole');
	assert.equal(decamelize('A\u{30A}Bcd'), 'a\u{30A}_bcd');
	assert.equal(decamelize('XA\u{30A}ngstro\u{308}m'), 'x_a\u{30A}ngstro\u{308}m');
	assert.equal(decamelize('E\u{301}COLEName'), 'e\u{301}cole_name');
	assert.equal(decamelize('cafe\u{301}Menu', {separator: '-'}), 'cafe\u{301}-menu');
});

test('splits words with decomposed accents with preserveConsecutiveUppercase', () => {
	const options = {preserveConsecutiveUppercase: true};
	assert.equal(decamelize('cafe\u{301}Menu', options), 'cafe\u{301}_menu');
	assert.equal(decamelize('XMLE\u{301}cole', options), 'XML_e\u{301}cole');
	assert.equal(decamelize('XA\u{30A}ngstro\u{308}m', options), 'X_a\u{30A}ngstro\u{308}m');

	// A combining mark after an uppercase letter did not count as part of an uppercase sequence, so the letter was lowercased.
	assert.equal(decamelize('E\u{301}COLEName', options), 'E\u{301}COLE_name');
	assert.equal(decamelize('dataForE\u{301}TAT', options), 'data_for_E\u{301}TAT');
	assert.equal(decamelize('A\u{30A}Bcd', options), 'A\u{30A}_bcd');
});

test('gives the same result for composed and decomposed input', () => {
	const inputs = ['caféMenu', 'naïveApproach', 'XMLÉcole', 'ÅBcd', 'XÅngström', 'ÉCOLEName', 'überÄrger', 'ÀÉÎÕÜ', 'São_PauloÉCity', 'dataForÉTAT', 'ÉtatÉ', 'aÉB'];
	for (const options of [{}, {preserveConsecutiveUppercase: true}, {separator: ' '}]) {
		assert.deepEqual(
			inputs.map(input => decamelize(input.normalize('NFD'), options)),
			inputs.map(input => decamelize(input, options).normalize('NFD')),
			JSON.stringify(options),
		);
	}
});

test('keeps plural acronyms together', () => {
	// The `s` of a plural acronym was taken as the start of a new word: `userIDs` → `user_i_ds`.
	assert.equal(decamelize('userIDs'), 'user_ids');
	assert.equal(decamelize('getURLs'), 'get_urls');
	assert.equal(decamelize('listAPIs'), 'list_apis');
	assert.equal(decamelize('IDs'), 'ids');
	assert.equal(decamelize('PDFs'), 'pdfs');
	assert.equal(decamelize('the_PDFs'), 'the_pdfs');
	assert.equal(decamelize('getURLs-fromAPIs'), 'get_urls-from_apis');
	assert.equal(decamelize('allIDs2'), 'all_i_ds2'); // A digit continues the word, like in `mp3Player`
	assert.equal(decamelize('userIDs', {separator: '-'}), 'user-ids');
	assert.equal(decamelize('E\u{301}TATs'), 'e\u{301}tats'); // Decomposed accent
	assert.equal(decamelize('listCAFE\u{301}s'), 'list_cafe\u{301}s'); // Decomposed accent on the last acronym letter
	assert.equal(decamelize('IDs\u{301}'), 'i_ds\u{301}'); // A decomposed `ś` is not a plural `s`, the same as a composed one
	assert.equal(decamelize('ID\u{15B}'), 'i_d\u{15B}');

	// A capitalized word starting with `s` after an acronym is still split.
	assert.equal(decamelize('HTTPSServer'), 'https_server');
	assert.equal(decamelize('XMLSchema'), 'xml_schema');

	// An `s` followed by more lowercase letters is not a plural, so the uppercase letter before it starts a new word.
	assert.equal(decamelize('APIsearch'), 'ap_isearch');
	assert.equal(decamelize('GPUsed'), 'gp_used');

	// Before a capitalized word, `Is`, `As`, `Us`, and `Os` after an acronym are words, which is more common than a plural acronym there. A plural acronym is therefore only recognized at the end of a word.
	assert.equal(decamelize('userIDIsValid'), 'user_id_is_valid');
	assert.equal(decamelize('fileURLIsDirectory'), 'file_url_is_directory');
	assert.equal(decamelize('XMLIsValid'), 'xml_is_valid');
	assert.equal(decamelize('URLAsString'), 'url_as_string');
	assert.equal(decamelize('isCPUUsHigh'), 'is_cpu_us_high');
	assert.equal(decamelize('userIDsList'), 'user_i_ds_list');

	// At the end of a word, a plural acronym is more common than a word: `exportPDFAs` is a known limitation.
	assert.equal(decamelize('exportPDFAs'), 'export_pdfas');

	// A single uppercase letter followed by `s` is a word.
	assert.equal(decamelize('thisIs'), 'this_is');
	assert.equal(decamelize('fooAs'), 'foo_as');
});

test('keeps plural acronyms together with preserveConsecutiveUppercase', () => {
	const options = {preserveConsecutiveUppercase: true};
	assert.equal(decamelize('userIDs', options), 'user_IDs');
	assert.equal(decamelize('listAPIs', options), 'list_APIs');
	assert.equal(decamelize('IDs', options), 'IDs');
	assert.equal(decamelize('getURLs-fromAPIs', options), 'get_URLs-from_APIs');
	assert.equal(decamelize('allIDs2', options), 'all_I_ds2');
	assert.equal(decamelize('E\u{301}TATs', options), 'E\u{301}TATs');
	assert.equal(decamelize('IDs\u{301}', options), 'I_ds\u{301}');
	assert.equal(decamelize('HTTPSServer', options), 'HTTPS_server');
	assert.equal(decamelize('userIDIsValid', options), 'user_ID_is_valid');
	assert.equal(decamelize('userIDsList', options), 'user_I_ds_list');
	assert.equal(decamelize('thisIs', options), 'this_is');
});

test('handles common identifier styles', () => {
	assert.equal(decamelize('createdAt'), 'created_at');
	assert.equal(decamelize('IN_PROGRESS'), 'in_progress');
	assert.equal(decamelize('XMLHttpRequest'), 'xml_http_request');
	assert.equal(decamelize('getHTTPResponseCode'), 'get_http_response_code');
	assert.equal(decamelize('getIDFromURL'), 'get_id_from_url');
	assert.equal(decamelize('isHTML5Compatible'), 'is_html5_compatible');
	assert.equal(decamelize('Top10Movies'), 'top10_movies');
	assert.equal(decamelize('oxygenO2Level'), 'oxygen_o2_level');
	assert.equal(decamelize('mp3Player'), 'mp3_player');
	assert.equal(decamelize('ABCDef'), 'abc_def');

	const options = {preserveConsecutiveUppercase: true};
	assert.equal(decamelize('IN_PROGRESS', options), 'IN_PROGRESS');
	assert.equal(decamelize('XMLHttpRequest', options), 'XML_http_request');
	assert.equal(decamelize('getHTTPResponseCode', options), 'get_HTTP_response_code');
	assert.equal(decamelize('getIDFromURL', options), 'get_ID_from_URL');
	assert.equal(decamelize('isHTML5Compatible', options), 'is_HTML5_compatible');
	assert.equal(decamelize('Top10Movies', options), 'top10_movies');
	assert.equal(decamelize('ABCDef', options), 'ABC_def');
	assert.equal(decamelize('foo_Bar', options), 'foo_bar');
});

test('handles other scripts', () => {
	assert.equal(decamelize('\u{43F}\u{440}\u{438}\u{432}\u{435}\u{442}\u{41C}\u{438}\u{440}'), '\u{43F}\u{440}\u{438}\u{432}\u{435}\u{442}_\u{43C}\u{438}\u{440}'); // `приветМир` → `привет_мир`
	assert.equal(decamelize('\u{10428}\u{10400}'), '\u{10428}_\u{10428}'); // Deseret, outside the basic multilingual plane
	assert.equal(decamelize('\u{10428}\u{10400}', {preserveConsecutiveUppercase: true}), '\u{10428}_\u{10428}');
	assert.equal(decamelize('\u{10400}\u{10401}s', {preserveConsecutiveUppercase: true}), '\u{10400}\u{10401}s'); // Plural after an acronym outside the basic multilingual plane
	assert.equal(decamelize('\u{10400}\u{10401}\u{10428}s', {preserveConsecutiveUppercase: true}), '\u{10400}_\u{10429}\u{10428}s');

	// A final sigma before a word boundary is lowercased to `ς`.
	assert.equal(decamelize('\u{39F}\u{394}\u{39F}\u{3A3}Bar'), '\u{3BF}\u{3B4}\u{3BF}\u{3C2}_bar');
});

test('casing with preserveConsecutiveUppercase does not depend on the separator', () => {
	const options = {preserveConsecutiveUppercase: true};
	assert.equal(decamelize('0S', options), '0_s');
	assert.equal(decamelize('0S', {...options, separator: ''}), '0s');
	assert.equal(decamelize('0S', {...options, separator: 'X'}), '0Xs');
	assert.equal(decamelize('oxygenO2Level', {...options, separator: ''}), 'oxygenO2level');
	assert.equal(decamelize('userIDs', {...options, separator: ''}), 'userIDs');
	assert.equal(decamelize('userIDIsValid', {...options, separator: ''}), 'userIDisvalid');
});

test('separator with letters is inserted once', () => {
	// The separator was inserted before the second split ran, so its letters could look like the end of an acronym.
	assert.equal(decamelize('aBc', {separator: 'X'}), 'aXbc');
	assert.equal(decamelize('fooBar', {separator: 'ABC'}), 'fooABCbar');
	assert.equal(decamelize('fooBar', {separator: 'ABC', preserveConsecutiveUppercase: true}), 'fooABCbar');
});

test('handles several combining marks on one uppercase letter', () => {
	// Vietnamese often stacks two marks on one letter.
	assert.equal(decamelize('XMLA\u{323}\u{306}p'), 'xml_a\u{323}\u{306}p'); // `XMLẶp`
	assert.equal(decamelize('XMLA\u{323}\u{306}p', {preserveConsecutiveUppercase: true}), 'XML_a\u{323}\u{306}p');
	assert.equal(decamelize('dataForE\u{323}\u{302}TAT', {preserveConsecutiveUppercase: true}), 'data_for_E\u{323}\u{302}TAT');
	assert.equal(decamelize('E\u{323}\u{302}TATs', {preserveConsecutiveUppercase: true}), 'E\u{323}\u{302}TATs');
	assert.equal(decamelize('E\u{323}\u{302}TATs'), 'e\u{323}\u{302}tats');
});

test('gives the same result for composed and decomposed plural acronyms', () => {
	const inputs = ['userÉTATs', 'ÉTATs', 'listCAFÉs', 'IDś', 'ÉTATIsValid', 'ÀÉs'];
	for (const options of [{}, {preserveConsecutiveUppercase: true}]) {
		assert.deepEqual(
			inputs.map(input => decamelize(input.normalize('NFD'), options)),
			inputs.map(input => decamelize(input, options).normalize('NFD')),
			JSON.stringify(options),
		);
	}
});

test('Performance: plural acronym patterns', () => {
	const inputs = [
		'ABs'.repeat(30_000),
		'A'.repeat(100_000) + 's',
		'AB' + 's'.repeat(100_000),
		('A' + '\u{301}'.repeat(10) + 's').repeat(10_000),
	];

	for (const preserveConsecutiveUppercase of [false, true]) {
		const ms = measureMs(() => {
			for (const input of inputs) {
				decamelize(input, {preserveConsecutiveUppercase});
			}
		});

		// Quadratic behavior would take minutes.
		assert.ok(ms < 1000, `expected <1000ms, got ${ms.toFixed(3)}ms`);
	}
});

test('long strings', () => {
	// Factor to increase the test string
	const times = 100;
	const longString = 'Lb8SvAARMshcNvfxjgGCgfot3AZAzysuxRpG9XfpLCz89TeWqAd3TUo64K45VH2MfjLYhztt4LQYzrEbTpx7gGcG4T8ueKPm6VraXKtULJdncFQhEQfCRwWGNscdFe6UTEAvN7Nze4Qy4hvZuKLX5YiohGpvNZUtLGen3WP2jot8VeprzyXQmiKdxdxrEResSRgSWENCzXZPSerYuEfApVbjuDJZ9kGMRXFRZQVyBDDGfY9ERqtxHQxPw65TtEo3dgwhcuhvC3dMyRJ6jWaonKB3Pqtv27vRv5MgYb5mgvCE55oCTBG9yASPaw2KqYVz3amBge9HggEzXJGhwSXjkL7jUYk3WjQUbwVnZNHkH3P9MpvM98DtTnGAYfK5TjD8Y5oXPRJmdCHzhByboaW2oRJ2Ft7dxGKXLs2s7qsQs8FsJHVcYrmVHRa6th5CizHSXK7vr5D3KYsfsnr92AmtR4LERam7CV9emBBuykQJMejLGFsvgTrBKmmUqijxSgY'.repeat(
		100,
	);

	assert.equal(
		decamelize(longString),
		Array.from({length: times})
			.fill(
				'lb8_sv_aar_mshc_nvfxjg_g_cgfot3_az_azysux_rp_g9_xfp_l_cz89_te_wq_ad3_t_uo64_k45_vh2_mfj_l_yhztt4_lq_yzr_eb_tpx7g_gc_g4_t8ue_k_pm6_vra_x_kt_ul_jdnc_f_qh_e_qf_c_rw_wg_nscd_fe6_ute_av_n7_nze4_qy4hv_zu_klx5_yioh_gpv_nz_ut_l_gen3_wp2jot8_veprzy_x_qmi_kdxdxr_e_res_s_rg_swen_cz_xzp_ser_yu_ef_ap_vbju_djz9k_gmrxfrzq_vy_bdd_gf_y9_e_rqtx_h_qx_pw65_tt_eo3dgwhcuhv_c3d_my_rj6j_waon_kb3_pqtv27v_rv5_mg_yb5mgv_ce55o_ctbg9y_as_paw2_kq_y_vz3am_bge9_hgg_ez_xj_ghw_s_xjk_l7j_u_yk3_wj_q_ubw_vn_zn_hk_h3_p9_mpv_m98_dt_tn_ga_yf_k5_tj_d8_y5o_xpr_jmd_c_hzh_byboa_w2o_rj2_ft7dx_gkx_ls2s7qs_qs8_fs_jh_vc_yrm_vh_ra6th5_ciz_hsxk7vr5_d3_k_ysfsnr92_amt_r4_le_ram7_cv9em_b_buyk_qj_mej_lg_fsvg_tr_b_kmm_uqijx_sg_y',
			)
			.join('_'),
	);
	assert.equal(
		decamelize(longString, {separator: '!'}),
		Array.from({length: times})
			.fill(
				'lb8!sv!aar!mshc!nvfxjg!g!cgfot3!az!azysux!rp!g9!xfp!l!cz89!te!wq!ad3!t!uo64!k45!vh2!mfj!l!yhztt4!lq!yzr!eb!tpx7g!gc!g4!t8ue!k!pm6!vra!x!kt!ul!jdnc!f!qh!e!qf!c!rw!wg!nscd!fe6!ute!av!n7!nze4!qy4hv!zu!klx5!yioh!gpv!nz!ut!l!gen3!wp2jot8!veprzy!x!qmi!kdxdxr!e!res!s!rg!swen!cz!xzp!ser!yu!ef!ap!vbju!djz9k!gmrxfrzq!vy!bdd!gf!y9!e!rqtx!h!qx!pw65!tt!eo3dgwhcuhv!c3d!my!rj6j!waon!kb3!pqtv27v!rv5!mg!yb5mgv!ce55o!ctbg9y!as!paw2!kq!y!vz3am!bge9!hgg!ez!xj!ghw!s!xjk!l7j!u!yk3!wj!q!ubw!vn!zn!hk!h3!p9!mpv!m98!dt!tn!ga!yf!k5!tj!d8!y5o!xpr!jmd!c!hzh!byboa!w2o!rj2!ft7dx!gkx!ls2s7qs!qs8!fs!jh!vc!yrm!vh!ra6th5!ciz!hsxk7vr5!d3!k!ysfsnr92!amt!r4!le!ram7!cv9em!b!buyk!qj!mej!lg!fsvg!tr!b!kmm!uqijx!sg!y',
			)
			.join('!'),
	);
	assert.equal(
		decamelize(longString, {
			separator: '!',
			preserveConsecutiveUppercase: true,
		}),
		Array.from({length: times})
			.fill(
				'lb8!sv!AAR!mshc!nvfxjg!G!cgfot3!AZ!azysux!rp!G9!xfp!L!cz89!te!wq!ad3!T!uo64!K45!VH2!mfj!L!yhztt4!LQ!yzr!eb!tpx7g!gc!G4!T8ue!K!pm6!vra!X!kt!UL!jdnc!F!qh!E!qf!C!rw!WG!nscd!fe6!UTE!av!N7!nze4!qy4hv!zu!KLX5!yioh!gpv!NZ!ut!L!gen3!WP2jot8!veprzy!X!qmi!kdxdxr!E!res!S!rg!SWEN!cz!XZP!ser!yu!ef!ap!vbju!DJZ9k!GMRXFRZQ!vy!BDD!gf!Y9!E!rqtx!H!qx!pw65!tt!eo3dgwhcuhv!C3d!my!RJ6j!waon!KB3!pqtv27v!rv5!mg!yb5mgv!CE55o!CTBG9y!AS!paw2!kq!Y!vz3am!bge9!hgg!ez!XJ!ghw!S!xjk!L7j!U!yk3!wj!Q!ubw!vn!ZN!hk!H3!P9!mpv!M98!dt!tn!GA!yf!K5!tj!D8!Y5o!XPR!jmd!C!hzh!byboa!W2o!RJ2!ft7dx!GKX!ls2s7qs!qs8!fs!JH!vc!yrm!VH!ra6th5!ciz!HSXK7vr5!D3!K!ysfsnr92!amt!R4!LE!ram7!CV9em!B!buyk!QJ!mej!LG!fsvg!tr!B!kmm!uqijx!sg!',
			)
			.join('Y!') + 'y',
	);
});

test('Performance: pathological input with preserveConsecutiveUppercase enabled', () => {
	const n = 100_000;
	const input = 'A'.repeat(n) + '[';

	// Warm-up JIT
	decamelize(input, {preserveConsecutiveUppercase: true});

	const ms = measureMs(() => {
		decamelize(input, {preserveConsecutiveUppercase: true});
	});

	// Should be well under this on CI after the regex fix.
	assert.ok(ms < 250, `expected <250ms, got ${ms.toFixed(3)}ms`);
});

test('Performance: pathological input with default options', () => {
	const n = 100_000;
	const input = 'A'.repeat(n) + '[';

	// Warm-up
	decamelize(input, {preserveConsecutiveUppercase: false});

	const ms = measureMs(() => {
		decamelize(input, {preserveConsecutiveUppercase: false});
	});

	// Default path was never affected; keep very generous bound.
	assert.ok(ms < 100, `expected <100ms, got ${ms.toFixed(3)}ms`);
});

test('Performance: single uppercase lookaround pattern', () => {
	// Exercise the single-uppercase-with-lookaround path.
	const n = 50_000;
	const input = ('aA').repeat(n);

	// Warm-up
	decamelize(input, {preserveConsecutiveUppercase: true});

	const ms = measureMs(() => {
		decamelize(input, {preserveConsecutiveUppercase: true});
	});

	// Generous bound to avoid flakiness in CI.
	assert.ok(ms < 250, `expected <250ms, got ${ms.toFixed(3)}ms`);
});

test('Performance: long runs of combining marks', () => {
	const mark = '\u{301}';
	const inputs = [
		mark.repeat(100_000),
		'a' + mark.repeat(100_000) + 'B',
		'A' + mark.repeat(100_000) + 'B' + mark.repeat(100_000) + '!',
		('A' + mark).repeat(50_000),
		('aB' + mark).repeat(30_000),
		('1' + mark).repeat(50_000) + 'a',
	];

	for (const preserveConsecutiveUppercase of [false, true]) {
		const ms = measureMs(() => {
			for (const input of inputs) {
				decamelize(input, {preserveConsecutiveUppercase});
			}
		});

		// Quadratic behavior would take minutes.
		assert.ok(ms < 1000, `expected <1000ms, got ${ms.toFixed(3)}ms`);
	}
});


test('rejects non-string inputs and separators', () => {
	for (const input of [undefined, null, 42, true, {}, [], new String('fooBar')]) {
		assert.throws(() => decamelize(input), {
			name: 'TypeError',
			message: 'The `text` and `separator` arguments should be of type `string`',
		});
	}

	for (const separator of [null, 42, true, {}, [], new String('_')]) {
		for (const input of ['', 'A', 'fooBar']) {
			assert.throws(() => decamelize(input, {separator}), TypeError);
		}
	}

	assert.equal(decamelize('fooBar', {separator: undefined}), 'foo_bar');
	assert.equal(decamelize('fooBar', undefined), 'foo_bar');
});

test('preserves the exact custom separator in both casing modes', () => {
	for (const separator of ['X', 'ABC', 'Å', 'İ', 'ΟΣ', 'xΣ', '$&', '$1', '$$', '$`', "$'", '', '\u{301}', '\n']) {
		assert.equal(decamelize('fooBarURL', {separator}), ['foo', 'bar', 'url'].join(separator));
		assert.equal(decamelize('fooBarURL', {separator, preserveConsecutiveUppercase: true}), ['foo', 'bar', 'URL'].join(separator));
		assert.equal(decamelize('XMLHttpRequest', {separator}), ['xml', 'http', 'request'].join(separator));
	}

	// Case conversion belongs to each word, so letters in a separator cannot change Greek final sigma.
	for (const separator of ['_', '', 'A', 'x']) {
		assert.equal(decamelize('ΟΣAlpha', {separator}), ['ος', 'alpha'].join(separator));
		assert.equal(decamelize('ΟΔΟΣName', {separator}), ['οδος', 'name'].join(separator));
	}

	assert.equal(decamelize('Foo', {separator: 'XYZ'}), 'foo');
	assert.equal(decamelize('fooXYZbar', {separator: 'XYZ'}), 'fooXYZxyXYZzbar');
});

test('recognizes titlecase letters at word boundaries', () => {
	const cases = [
		['helloǅuro', 'hello_ǆuro', 'hello_ǆuro'],
		['ǅuroName', 'ǆuro_name', 'ǆuro_name'],
		['XMLǅuro', 'xml_ǆuro', 'XML_ǆuro'],
		['fooǈubav', 'foo_ǉubav', 'foo_ǉubav'],
		['fooǋegoš', 'foo_ǌegoš', 'foo_ǌegoš'],
		['aᾈλφα', 'a_ᾀλφα', 'a_ᾀλφα'],
		['nameǅ', 'name_ǆ', 'name_ǆ'],
		['ǅǅName', 'ǆǆ_name', 'ǅǅ_name'],
		['ᾼB', 'ᾳb', 'ᾼB'],
	];

	for (const [input, lowercased, preserved] of cases) {
		for (const separator of ['_', '-', '', 'X']) {
			assert.equal(decamelize(input, {separator}), lowercased.replaceAll('_', separator));
			assert.equal(decamelize(input, {separator, preserveConsecutiveUppercase: true}), preserved.replaceAll('_', separator));
		}

		for (const preserveConsecutiveUppercase of [false, true]) {
			assert.equal(decamelize(input.normalize('NFD'), {preserveConsecutiveUppercase}), decamelize(input, {preserveConsecutiveUppercase}).normalize('NFD'));
		}
	}
});

test('recognizes Unicode decimal digits at word boundaries', () => {
	for (const digit of ['٢', '۲', '२', '২', '๒', '２', '\u{104A2}', '\u{1D7DA}']) {
		for (const separator of ['_', '-', '', 'X']) {
			for (const preserveConsecutiveUppercase of [false, true]) {
				const options = {separator, preserveConsecutiveUppercase};
				assert.equal(decamelize(`version${digit}Value`, options), `version${digit}${separator}value`);
				assert.equal(decamelize(`${digit}Value`, options), `${digit}${separator}value`);
				assert.equal(decamelize(`version${digit}${digit}Value`, options), `version${digit}${digit}${separator}value`);
				assert.equal(decamelize(`version${digit}\u{301}Value`, options), `version${digit}\u{301}${separator}value`);
				assert.equal(decamelize(`A${digit}B`, options), `${preserveConsecutiveUppercase ? 'A' : 'a'}${digit}${separator}b`);
				assert.equal(decamelize(`allIDs${digit}`, options), `all${separator}${preserveConsecutiveUppercase ? 'I' : 'i'}${separator}ds${digit}`);
				assert.equal(decamelize(digit.repeat(3), options), digit.repeat(3));
			}
		}
	}
});

test('recognizes Unicode casing outside letter categories', () => {
	const cases = [
		['fooⅣBar', 'foo_ⅳ_bar', 'foo_Ⅳ_bar'],
		['ⅣValue', 'ⅳ_value', 'Ⅳ_value'],
		['valueⅳName', 'valueⅳ_name', 'valueⅳ_name'],
		['ᵃName', 'ᵃ_name', 'ᵃ_name'],
		['fooⒶBar', 'foo_ⓐ_bar', 'foo_Ⓐ_bar'],
		['ⓐName', 'ⓐ_name', 'ⓐ_name'],
		['fooⅣⅤ', 'foo_ⅳⅴ', 'foo_ⅣⅤ'],
		['ⅣⅤs', 'ⅳⅴs', 'ⅣⅤs'],
		['ABsⅣ', 'a_bs_ⅳ', 'A_bs_ⅳ'],
		['ABsⓐ', 'a_bsⓐ', 'A_bsⓐ'],
	];

	for (const [input, lowercased, preserved] of cases) {
		for (const separator of ['_', '-', '', 'X']) {
			assert.equal(decamelize(input, {separator}), lowercased.replaceAll('_', separator));
			assert.equal(decamelize(input, {separator, preserveConsecutiveUppercase: true}), preserved.replaceAll('_', separator));
		}
	}

	// U+0345 has the Lowercase property, but is a combining mark belonging to its base letter.
	for (const input of ['ᾼB', 'ᾼBC', 'Α\u{345}B', 'A\u{345}b', 'AB\u{345}c']) {
		for (const preserveConsecutiveUppercase of [false, true]) {
			assert.equal(decamelize(input.normalize('NFD'), {preserveConsecutiveUppercase}), decamelize(input, {preserveConsecutiveUppercase}).normalize('NFD'));
		}
	}

	assert.equal(decamelize('\u{345}B'), '\u{345}b');
});
