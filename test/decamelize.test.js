import {expect, test} from '@jest/globals';
import decamelize from '../index.js';

const times = 100;

const cases = [
	['decamelize', {text: ''}, ''],
	['decamelize', {text: 'A'}, 'a'],
	['decamelize', {text: 'A B'}, 'a b'],
	['decamelize', {text: 'a2b'}, 'a2b'],
	['decamelize', {text: '_A2B'}, '_a2_b'],
	['decamelize', {text: 'myURLstring'}, 'my_ur_lstring'],
	['decamelize', {text: 'unicornsAndRainbows'}, 'unicorns_and_rainbows'],
	['decamelize', {text: 'UNICORNS AND RAINBOWS'}, 'unicorns and rainbows'],
	['decamelize', {text: 'unicorns-and-rainbows'}, 'unicorns-and-rainbows'],
	['decamelize', {text: 'thisIsATest'}, 'this_is_a_test'],
	['decamelize', {text: 'thisIsATest', separator: ' '}, 'this is a test'],
	['decamelize', {text: 'unicornRainbow', separator: '|'}, 'unicorn|rainbow'],
	['decamelize', {text: 'unicornRainbow', separator: '-'}, 'unicorn-rainbow'],
	[
		'decamelize',
		{text: 'thisHasSpecialCharactersLikeČandŠ', separator: ' '},
		'this has special characters like čand š',
	],

	['handles acronyms', {text: 'myURLString'}, 'my_url_string'],
	['handles acronyms', {text: 'URLString'}, 'url_string'],
	['handles acronyms', {text: 'StringURL'}, 'string_url'],
	['handles acronyms', {text: 'testGUILabel'}, 'test_gui_label'],
	['handles acronyms', {text: 'CAPLOCKED1'}, 'caplocked1'],

	['separator in string', {text: 'my_URL_string'}, 'my_url_string'],
	[
		'separator and options passed',
		{text: 'testGUILabel',
			separator: '!',
			preserveConsecutiveUppercase: true},
		'test!GUI!label',
	],

	[
		'keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow',
		{text: 'A', preserveConsecutiveUppercase: true},
		'A',
	],
	[
		'keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow',
		{text: 'myURLString', preserveConsecutiveUppercase: true},
		'my_URL_string',
	],
	[
		'keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow',
		{text: 'URLString', preserveConsecutiveUppercase: true},
		'URL_string',
	],
	[
		'keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow',
		{text: 'oxygenO2Level', preserveConsecutiveUppercase: true},
		'oxygen_O2_level',
	],
	[
		'keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow',
		{text: 'StringURL', preserveConsecutiveUppercase: true},
		'string_URL',
	],
	[
		'keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow',
		{text: 'STringURL', preserveConsecutiveUppercase: true},
		'S_tring_URL',
	],
	[
		'keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow',
		{text: 'numberOfDataForUSA', preserveConsecutiveUppercase: true},
		'number_of_data_for_USA',
	],
	[
		'keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow',
		{text: 'testGUILabel', preserveConsecutiveUppercase: true},
		'test_GUI_label',
	],
	[
		'keeping blocks of consecutive uppercase characters but split the last if lowercase characters follow',
		{text: 'CAPLOCKED1', preserveConsecutiveUppercase: true},
		'CAPLOCKED1',
	],

	[
		'long strings',
		{text: 'Lb8SvAARMshcNvfxjgGCgfot3AZAzysuxRpG9XfpLCz89TeWqAd3TUo64K45VH2MfjLYhztt4LQYzrEbTpx7gGcG4T8ueKPm6VraXKtULJdncFQhEQfCRwWGNscdFe6UTEAvN7Nze4Qy4hvZuKLX5YiohGpvNZUtLGen3WP2jot8VeprzyXQmiKdxdxrEResSRgSWENCzXZPSerYuEfApVbjuDJZ9kGMRXFRZQVyBDDGfY9ERqtxHQxPw65TtEo3dgwhcuhvC3dMyRJ6jWaonKB3Pqtv27vRv5MgYb5mgvCE55oCTBG9yASPaw2KqYVz3amBge9HggEzXJGhwSXjkL7jUYk3WjQUbwVnZNHkH3P9MpvM98DtTnGAYfK5TjD8Y5oXPRJmdCHzhByboaW2oRJ2Ft7dxGKXLs2s7qsQs8FsJHVcYrmVHRa6th5CizHSXK7vr5D3KYsfsnr92AmtR4LERam7CV9emBBuykQJMejLGFsvgTrBKmmUqijxSgY'.repeat(
			times,
		),
		},
		Array.from({length: times})
			.fill(
				'lb8_sv_aar_mshc_nvfxjg_g_cgfot3_az_azysux_rp_g9_xfp_l_cz89_te_wq_ad3_t_uo64_k45_vh2_mfj_l_yhztt4_lq_yzr_eb_tpx7g_gc_g4_t8ue_k_pm6_vra_x_kt_ul_jdnc_f_qh_e_qf_c_rw_wg_nscd_fe6_ute_av_n7_nze4_qy4hv_zu_klx5_yioh_gpv_nz_ut_l_gen3_wp2jot8_veprzy_x_qmi_kdxdxr_e_res_s_rg_swen_cz_xzp_ser_yu_ef_ap_vbju_djz9k_gmrxfrzq_vy_bdd_gf_y9_e_rqtx_h_qx_pw65_tt_eo3dgwhcuhv_c3d_my_rj6j_waon_kb3_pqtv27v_rv5_mg_yb5mgv_ce55o_ctbg9y_as_paw2_kq_y_vz3am_bge9_hgg_ez_xj_ghw_s_xjk_l7j_u_yk3_wj_q_ubw_vn_zn_hk_h3_p9_mpv_m98_dt_tn_ga_yf_k5_tj_d8_y5o_xpr_jmd_c_hzh_byboa_w2o_rj2_ft7dx_gkx_ls2s7qs_qs8_fs_jh_vc_yrm_vh_ra6th5_ciz_hsxk7vr5_d3_k_ysfsnr92_amt_r4_le_ram7_cv9em_b_buyk_qj_mej_lg_fsvg_tr_b_kmm_uqijx_sg_y',
			)
			.join('_'),
	],
	[
		'long strings',
		{
			text: 'Lb8SvAARMshcNvfxjgGCgfot3AZAzysuxRpG9XfpLCz89TeWqAd3TUo64K45VH2MfjLYhztt4LQYzrEbTpx7gGcG4T8ueKPm6VraXKtULJdncFQhEQfCRwWGNscdFe6UTEAvN7Nze4Qy4hvZuKLX5YiohGpvNZUtLGen3WP2jot8VeprzyXQmiKdxdxrEResSRgSWENCzXZPSerYuEfApVbjuDJZ9kGMRXFRZQVyBDDGfY9ERqtxHQxPw65TtEo3dgwhcuhvC3dMyRJ6jWaonKB3Pqtv27vRv5MgYb5mgvCE55oCTBG9yASPaw2KqYVz3amBge9HggEzXJGhwSXjkL7jUYk3WjQUbwVnZNHkH3P9MpvM98DtTnGAYfK5TjD8Y5oXPRJmdCHzhByboaW2oRJ2Ft7dxGKXLs2s7qsQs8FsJHVcYrmVHRa6th5CizHSXK7vr5D3KYsfsnr92AmtR4LERam7CV9emBBuykQJMejLGFsvgTrBKmmUqijxSgY'.repeat(
				times,
			),
			separator: '!',
		},
		Array.from({length: times})
			.fill(
				'lb8!sv!aar!mshc!nvfxjg!g!cgfot3!az!azysux!rp!g9!xfp!l!cz89!te!wq!ad3!t!uo64!k45!vh2!mfj!l!yhztt4!lq!yzr!eb!tpx7g!gc!g4!t8ue!k!pm6!vra!x!kt!ul!jdnc!f!qh!e!qf!c!rw!wg!nscd!fe6!ute!av!n7!nze4!qy4hv!zu!klx5!yioh!gpv!nz!ut!l!gen3!wp2jot8!veprzy!x!qmi!kdxdxr!e!res!s!rg!swen!cz!xzp!ser!yu!ef!ap!vbju!djz9k!gmrxfrzq!vy!bdd!gf!y9!e!rqtx!h!qx!pw65!tt!eo3dgwhcuhv!c3d!my!rj6j!waon!kb3!pqtv27v!rv5!mg!yb5mgv!ce55o!ctbg9y!as!paw2!kq!y!vz3am!bge9!hgg!ez!xj!ghw!s!xjk!l7j!u!yk3!wj!q!ubw!vn!zn!hk!h3!p9!mpv!m98!dt!tn!ga!yf!k5!tj!d8!y5o!xpr!jmd!c!hzh!byboa!w2o!rj2!ft7dx!gkx!ls2s7qs!qs8!fs!jh!vc!yrm!vh!ra6th5!ciz!hsxk7vr5!d3!k!ysfsnr92!amt!r4!le!ram7!cv9em!b!buyk!qj!mej!lg!fsvg!tr!b!kmm!uqijx!sg!y',
			)
			.join('!'),
	],
	[
		'long strings',
		{
			text: 'Lb8SvAARMshcNvfxjgGCgfot3AZAzysuxRpG9XfpLCz89TeWqAd3TUo64K45VH2MfjLYhztt4LQYzrEbTpx7gGcG4T8ueKPm6VraXKtULJdncFQhEQfCRwWGNscdFe6UTEAvN7Nze4Qy4hvZuKLX5YiohGpvNZUtLGen3WP2jot8VeprzyXQmiKdxdxrEResSRgSWENCzXZPSerYuEfApVbjuDJZ9kGMRXFRZQVyBDDGfY9ERqtxHQxPw65TtEo3dgwhcuhvC3dMyRJ6jWaonKB3Pqtv27vRv5MgYb5mgvCE55oCTBG9yASPaw2KqYVz3amBge9HggEzXJGhwSXjkL7jUYk3WjQUbwVnZNHkH3P9MpvM98DtTnGAYfK5TjD8Y5oXPRJmdCHzhByboaW2oRJ2Ft7dxGKXLs2s7qsQs8FsJHVcYrmVHRa6th5CizHSXK7vr5D3KYsfsnr92AmtR4LERam7CV9emBBuykQJMejLGFsvgTrBKmmUqijxSgY'.repeat(
				times,
			),
			separator: '!',
			preserveConsecutiveUppercase: true},
		Array.from({length: times})
			.fill(
				'lb8!sv!AAR!mshc!nvfxjg!G!cgfot3!AZ!azysux!rp!G9!xfp!L!cz89!te!wq!ad3!T!uo64!K45!VH2!mfj!L!yhztt4!LQ!yzr!eb!tpx7g!gc!G4!T8ue!K!pm6!vra!X!kt!UL!jdnc!F!qh!E!qf!C!rw!WG!nscd!fe6!UTE!av!N7!nze4!qy4hv!zu!KLX5!yioh!gpv!NZ!ut!L!gen3!WP2jot8!veprzy!X!qmi!kdxdxr!E!res!S!rg!SWEN!cz!XZP!ser!yu!ef!ap!vbju!DJZ9k!GMRXFRZQ!vy!BDD!gf!Y9!E!rqtx!H!qx!pw65!tt!eo3dgwhcuhv!C3d!my!RJ6j!waon!KB3!pqtv27v!rv5!mg!yb5mgv!CE55o!CTBG9y!AS!paw2!kq!Y!vz3am!bge9!hgg!ez!XJ!ghw!S!xjk!L7j!U!yk3!wj!Q!ubw!vn!ZN!hk!H3!P9!mpv!M98!dt!tn!GA!yf!K5!tj!D8!Y5o!XPR!jmd!C!hzh!byboa!W2o!RJ2!ft7dx!GKX!ls2s7qs!qs8!fs!JH!vc!yrm!VH!ra6th5!ciz!HSXK7vr5!D3!K!ysfsnr92!amt!R4!LE!ram7!CV9em!B!buyk!QJ!mej!LG!fsvg!tr!B!kmm!uqijx!sg!',
			)
			.join('Y!') + 'y',
	],
];

test.each(cases)('%s %s %s', async (a, b, expected) => {
	expect(
		decamelize(b.text, {
			separator: b.separator,
			preserveConsecutiveUppercase: b.preserveConsecutiveUppercase,
		}),
	).toBe(expected);
});
