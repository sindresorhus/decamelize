import process from 'node:process';
import test from 'ava';
import decamelize from './index.js';

const measureMs = fn => {
	const start = process.hrtime.bigint();
	fn();
	const end = process.hrtime.bigint();
	return Number(end - start) / 1e6;
};

test('decamelize', t => {
	t.is(decamelize(''), '');
	t.is(decamelize('A'), 'a');
	t.is(decamelize('A B'), 'a b');
	t.is(decamelize('a2b'), 'a2b');
	t.is(decamelize('A2B'), 'a2_b');
	t.is(decamelize('_A2B'), '_a2_b');
	t.is(decamelize('myURLstring'), 'my_ur_lstring');
	t.is(decamelize('unicornsAndRainbows'), 'unicorns_and_rainbows');
	t.is(decamelize('UNICORNS AND RAINBOWS'), 'unicorns and rainbows');
	t.is(decamelize('unicorns-and-rainbows'), 'unicorns-and-rainbows');
	t.is(decamelize('thisIsATest'), 'this_is_a_test');
	t.is(decamelize('thisIsATest', {separator: ' '}), 'this is a test');
	t.is(decamelize('thisIsATest', {separator: ''}), 'thisisatest');
	t.is(decamelize('unicornRainbow', {separator: '|'}), 'unicorn|rainbow');
	t.is(decamelize('unicornRainbow', {separator: '-'}), 'unicorn-rainbow');
	t.is(
		decamelize('thisHasSpecialCharactersLikeČandŠ', {separator: ' '}),
		'this has special characters like čand š',
	);
});

test('handles acronyms', t => {
	t.is(decamelize('myURLString'), 'my_url_string');
	t.is(decamelize('URLString'), 'url_string');
	t.is(decamelize('StringURL'), 'string_url');
	t.is(decamelize('testGUILabel'), 'test_gui_label');
	t.is(decamelize('CAPLOCKED1'), 'caplocked1');
});

test('separator in string', t => {
	t.is(decamelize('my_URL_string'), 'my_url_string');
});

test('separator with replacement patterns is inserted literally', t => {
	t.is(decamelize('helloWorld', {separator: '$&'}), 'hello$&world');
	t.is(decamelize('myURLString', {separator: '$1'}), 'my$1url$1string');
	t.is(
		decamelize('testGUILabel', {
			separator: '$$',
			preserveConsecutiveUppercase: true,
		}),
		'test$$GUI$$label',
	);
});

test('separator and options passed', t => {
	t.is(
		decamelize('testGUILabel', {
			separator: '!',
			preserveConsecutiveUppercase: true,
		}),
		'test!GUI!label',
	);
});

test('keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow', t => {
	t.is(
		decamelize('A', {
			preserveConsecutiveUppercase: true,
		}),
		'A',
	);
	t.is(
		decamelize('myURLString', {
			preserveConsecutiveUppercase: true,
		}),
		'my_URL_string',
	);
	t.is(
		decamelize('URLString', {
			preserveConsecutiveUppercase: true,
		}),
		'URL_string',
	);
	t.is(
		decamelize('oxygenO2Level', {
			preserveConsecutiveUppercase: true,
		}),
		'oxygen_O2_level',
	);
	t.is(
		decamelize('StringURL', {
			preserveConsecutiveUppercase: true,
		}),
		'string_URL',
	);
	t.is(
		decamelize('STringURL', {
			preserveConsecutiveUppercase: true,
		}),
		'S_tring_URL',
	);
	t.is(
		decamelize('numberOfDataForUSA', {
			preserveConsecutiveUppercase: true,
		}),
		'number_of_data_for_USA',
	);
	t.is(
		decamelize('testGUILabel', {
			preserveConsecutiveUppercase: true,
		}),
		'test_GUI_label',
	);
	t.is(
		decamelize('CAPLOCKED1', {
			preserveConsecutiveUppercase: true,
		}),
		'CAPLOCKED1',
	);
	/// t.is(
	// 	decamelize('aBC', {
	// 		preserveConsecutiveUppercase: true,
	// 	}),
	// 	'a_b_c',
	// );
});

test('splits words with decomposed accents', t => {
	// Decomposed (NFD) text, common in macOS file names, puts a combining mark after the base letter, which hid the word boundary.
	t.is(decamelize('cafe\u{301}Menu'), 'cafe\u{301}_menu');
	t.is(decamelize('nai\u{308}veApproach'), 'nai\u{308}ve_approach');
	t.is(decamelize('pho\u{302}\u{301}Bar'), 'pho\u{302}\u{301}_bar'); // Several marks
	t.is(decamelize('XMLE\u{301}cole'), 'xml_e\u{301}cole');
	t.is(decamelize('A\u{30A}Bcd'), 'a\u{30A}_bcd');
	t.is(decamelize('XA\u{30A}ngstro\u{308}m'), 'x_a\u{30A}ngstro\u{308}m');
	t.is(decamelize('E\u{301}COLEName'), 'e\u{301}cole_name');
	t.is(decamelize('cafe\u{301}Menu', {separator: '-'}), 'cafe\u{301}-menu');
});

test('splits words with decomposed accents with preserveConsecutiveUppercase', t => {
	const options = {preserveConsecutiveUppercase: true};
	t.is(decamelize('cafe\u{301}Menu', options), 'cafe\u{301}_menu');
	t.is(decamelize('XMLE\u{301}cole', options), 'XML_e\u{301}cole');
	t.is(decamelize('XA\u{30A}ngstro\u{308}m', options), 'X_a\u{30A}ngstro\u{308}m');

	// A combining mark after an uppercase letter did not count as part of an uppercase sequence, so the letter was lowercased.
	t.is(decamelize('E\u{301}COLEName', options), 'E\u{301}COLE_name');
	t.is(decamelize('dataForE\u{301}TAT', options), 'data_for_E\u{301}TAT');
	t.is(decamelize('A\u{30A}Bcd', options), 'A\u{30A}_bcd');
});

test('gives the same result for composed and decomposed input', t => {
	const inputs = ['caféMenu', 'naïveApproach', 'XMLÉcole', 'ÅBcd', 'XÅngström', 'ÉCOLEName', 'überÄrger', 'ÀÉÎÕÜ', 'São_PauloÉCity', 'dataForÉTAT', 'ÉtatÉ', 'aÉB'];
	for (const options of [{}, {preserveConsecutiveUppercase: true}, {separator: ' '}]) {
		t.deepEqual(
			inputs.map(input => decamelize(input.normalize('NFD'), options)),
			inputs.map(input => decamelize(input, options).normalize('NFD')),
			JSON.stringify(options),
		);
	}
});

test('keeps plural acronyms together', t => {
	// The `s` of a plural acronym was taken as the start of a new word: `userIDs` → `user_i_ds`.
	t.is(decamelize('userIDs'), 'user_ids');
	t.is(decamelize('getURLs'), 'get_urls');
	t.is(decamelize('listAPIs'), 'list_apis');
	t.is(decamelize('IDs'), 'ids');
	t.is(decamelize('PDFs'), 'pdfs');
	t.is(decamelize('the_PDFs'), 'the_pdfs');
	t.is(decamelize('getURLs-fromAPIs'), 'get_urls-from_apis');
	t.is(decamelize('allIDs2'), 'all_i_ds2'); // A digit continues the word, like in `mp3Player`
	t.is(decamelize('userIDs', {separator: '-'}), 'user-ids');
	t.is(decamelize('E\u{301}TATs'), 'e\u{301}tats'); // Decomposed accent
	t.is(decamelize('listCAFE\u{301}s'), 'list_cafe\u{301}s'); // Decomposed accent on the last acronym letter
	t.is(decamelize('IDs\u{301}'), 'i_ds\u{301}'); // A decomposed `ś` is not a plural `s`, the same as a composed one
	t.is(decamelize('ID\u{15B}'), 'i_d\u{15B}');

	// A capitalized word starting with `s` after an acronym is still split.
	t.is(decamelize('HTTPSServer'), 'https_server');
	t.is(decamelize('XMLSchema'), 'xml_schema');

	// An `s` followed by more lowercase letters is not a plural, so the uppercase letter before it starts a new word.
	t.is(decamelize('APIsearch'), 'ap_isearch');
	t.is(decamelize('GPUsed'), 'gp_used');

	// Before a capitalized word, `Is`, `As`, `Us`, and `Os` after an acronym are words, which is more common than a plural acronym there. A plural acronym is therefore only recognized at the end of a word.
	t.is(decamelize('userIDIsValid'), 'user_id_is_valid');
	t.is(decamelize('fileURLIsDirectory'), 'file_url_is_directory');
	t.is(decamelize('XMLIsValid'), 'xml_is_valid');
	t.is(decamelize('URLAsString'), 'url_as_string');
	t.is(decamelize('isCPUUsHigh'), 'is_cpu_us_high');
	t.is(decamelize('userIDsList'), 'user_i_ds_list');

	// At the end of a word, a plural acronym is more common than a word: `exportPDFAs` is a known limitation.
	t.is(decamelize('exportPDFAs'), 'export_pdfas');

	// A single uppercase letter followed by `s` is a word.
	t.is(decamelize('thisIs'), 'this_is');
	t.is(decamelize('fooAs'), 'foo_as');
});

test('keeps plural acronyms together with preserveConsecutiveUppercase', t => {
	const options = {preserveConsecutiveUppercase: true};
	t.is(decamelize('userIDs', options), 'user_IDs');
	t.is(decamelize('listAPIs', options), 'list_APIs');
	t.is(decamelize('IDs', options), 'IDs');
	t.is(decamelize('getURLs-fromAPIs', options), 'get_URLs-from_APIs');
	t.is(decamelize('allIDs2', options), 'all_I_ds2');
	t.is(decamelize('E\u{301}TATs', options), 'E\u{301}TATs');
	t.is(decamelize('IDs\u{301}', options), 'I_ds\u{301}');
	t.is(decamelize('HTTPSServer', options), 'HTTPS_server');
	t.is(decamelize('userIDIsValid', options), 'user_ID_is_valid');
	t.is(decamelize('userIDsList', options), 'user_I_ds_list');
	t.is(decamelize('thisIs', options), 'this_is');
});

test('long strings', t => {
	// Factor to increase the test string
	const times = 100;
	const longString = 'Lb8SvAARMshcNvfxjgGCgfot3AZAzysuxRpG9XfpLCz89TeWqAd3TUo64K45VH2MfjLYhztt4LQYzrEbTpx7gGcG4T8ueKPm6VraXKtULJdncFQhEQfCRwWGNscdFe6UTEAvN7Nze4Qy4hvZuKLX5YiohGpvNZUtLGen3WP2jot8VeprzyXQmiKdxdxrEResSRgSWENCzXZPSerYuEfApVbjuDJZ9kGMRXFRZQVyBDDGfY9ERqtxHQxPw65TtEo3dgwhcuhvC3dMyRJ6jWaonKB3Pqtv27vRv5MgYb5mgvCE55oCTBG9yASPaw2KqYVz3amBge9HggEzXJGhwSXjkL7jUYk3WjQUbwVnZNHkH3P9MpvM98DtTnGAYfK5TjD8Y5oXPRJmdCHzhByboaW2oRJ2Ft7dxGKXLs2s7qsQs8FsJHVcYrmVHRa6th5CizHSXK7vr5D3KYsfsnr92AmtR4LERam7CV9emBBuykQJMejLGFsvgTrBKmmUqijxSgY'.repeat(
		100,
	);

	t.is(
		decamelize(longString),
		Array.from({length: times})
			.fill(
				'lb8_sv_aar_mshc_nvfxjg_g_cgfot3_az_azysux_rp_g9_xfp_l_cz89_te_wq_ad3_t_uo64_k45_vh2_mfj_l_yhztt4_lq_yzr_eb_tpx7g_gc_g4_t8ue_k_pm6_vra_x_kt_ul_jdnc_f_qh_e_qf_c_rw_wg_nscd_fe6_ute_av_n7_nze4_qy4hv_zu_klx5_yioh_gpv_nz_ut_l_gen3_wp2jot8_veprzy_x_qmi_kdxdxr_e_res_s_rg_swen_cz_xzp_ser_yu_ef_ap_vbju_djz9k_gmrxfrzq_vy_bdd_gf_y9_e_rqtx_h_qx_pw65_tt_eo3dgwhcuhv_c3d_my_rj6j_waon_kb3_pqtv27v_rv5_mg_yb5mgv_ce55o_ctbg9y_as_paw2_kq_y_vz3am_bge9_hgg_ez_xj_ghw_s_xjk_l7j_u_yk3_wj_q_ubw_vn_zn_hk_h3_p9_mpv_m98_dt_tn_ga_yf_k5_tj_d8_y5o_xpr_jmd_c_hzh_byboa_w2o_rj2_ft7dx_gkx_ls2s7qs_qs8_fs_jh_vc_yrm_vh_ra6th5_ciz_hsxk7vr5_d3_k_ysfsnr92_amt_r4_le_ram7_cv9em_b_buyk_qj_mej_lg_fsvg_tr_b_kmm_uqijx_sg_y',
			)
			.join('_'),
	);
	t.is(
		decamelize(longString, {separator: '!'}),
		Array.from({length: times})
			.fill(
				'lb8!sv!aar!mshc!nvfxjg!g!cgfot3!az!azysux!rp!g9!xfp!l!cz89!te!wq!ad3!t!uo64!k45!vh2!mfj!l!yhztt4!lq!yzr!eb!tpx7g!gc!g4!t8ue!k!pm6!vra!x!kt!ul!jdnc!f!qh!e!qf!c!rw!wg!nscd!fe6!ute!av!n7!nze4!qy4hv!zu!klx5!yioh!gpv!nz!ut!l!gen3!wp2jot8!veprzy!x!qmi!kdxdxr!e!res!s!rg!swen!cz!xzp!ser!yu!ef!ap!vbju!djz9k!gmrxfrzq!vy!bdd!gf!y9!e!rqtx!h!qx!pw65!tt!eo3dgwhcuhv!c3d!my!rj6j!waon!kb3!pqtv27v!rv5!mg!yb5mgv!ce55o!ctbg9y!as!paw2!kq!y!vz3am!bge9!hgg!ez!xj!ghw!s!xjk!l7j!u!yk3!wj!q!ubw!vn!zn!hk!h3!p9!mpv!m98!dt!tn!ga!yf!k5!tj!d8!y5o!xpr!jmd!c!hzh!byboa!w2o!rj2!ft7dx!gkx!ls2s7qs!qs8!fs!jh!vc!yrm!vh!ra6th5!ciz!hsxk7vr5!d3!k!ysfsnr92!amt!r4!le!ram7!cv9em!b!buyk!qj!mej!lg!fsvg!tr!b!kmm!uqijx!sg!y',
			)
			.join('!'),
	);
	t.is(
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

test('Performance: pathological input with preserveConsecutiveUppercase enabled', t => {
	const n = 100_000;
	const input = 'A'.repeat(n) + '[';

	// Warm-up JIT
	decamelize(input, {preserveConsecutiveUppercase: true});

	const ms = measureMs(() => {
		decamelize(input, {preserveConsecutiveUppercase: true});
	});

	// Should be well under this on CI after the regex fix.
	t.true(ms < 250, `expected <250ms, got ${ms.toFixed(3)}ms`);
});

test('Performance: pathological input with default options', t => {
	const n = 100_000;
	const input = 'A'.repeat(n) + '[';

	// Warm-up
	decamelize(input, {preserveConsecutiveUppercase: false});

	const ms = measureMs(() => {
		decamelize(input, {preserveConsecutiveUppercase: false});
	});

	// Default path was never affected; keep very generous bound.
	t.true(ms < 100, `expected <100ms, got ${ms.toFixed(3)}ms`);
});

test('Performance: single uppercase lookaround pattern', t => {
	// Exercise the single-uppercase-with-lookaround path.
	const n = 50_000;
	const input = ('aA').repeat(n);

	// Warm-up
	decamelize(input, {preserveConsecutiveUppercase: true});

	const ms = measureMs(() => {
		decamelize(input, {preserveConsecutiveUppercase: true});
	});

	// Generous bound to avoid flakiness in CI.
	t.true(ms < 250, `expected <250ms, got ${ms.toFixed(3)}ms`);
});

test('Performance: long runs of combining marks', t => {
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
		t.true(ms < 1000, `expected <1000ms, got ${ms.toFixed(3)}ms`);
	}
});
