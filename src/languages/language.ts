/**
 * In the name of Allah, the Beneficent, the Merciful.
 * @package shcalendar - The Calendar Related Extensions SH{Shamsi Hijri, Solar Hijri, Iranian Hijri}
 * @link http://git.akhi.ir/js/SHDate | https://github.com/md-akhi/SHCalendar-js#readme
 */
import Language_fa_IR from "./i18n/fa_IR.js";
import Language_en_US from "./i18n/en_US.js";
// import Language_ckb_IR from "./l10n/ckb_IR.js";

/**
 * list of supported languages
 */
export enum Languages {
	//i18n
	fa_IR = "fa_IR",
	en_US = "en_US"

	//l10n
	// ckb_IR = "ckb_IR"
}

export default class Language {
	static readonly LANGUAGES = Languages;
	static readonly DEFAULT_LANGUAGE: string = Language.LANGUAGES.en_US;

	/**
	 * cheeck Language
	 * @param {string} language
	 * @return string
	 */
	static check(language: any): boolean {
		return Object.values(Language.LANGUAGES).includes(language);
	}

	/**
	 * Get Language class
	 * @param {string} language
	 * @return string
	 */
	static getClass(language: string): any {
		switch (language) {
			// i18n
			case Language.LANGUAGES.fa_IR:
				return Language_fa_IR;
			case Language.LANGUAGES.en_US:
				return Language_en_US;
			//i10n
			// case Language.LANGUAGES.ckb_IR:
			// 	return Language_ckb_IR;
			default:
				return Language.getClass(Language.DEFAULT_LANGUAGE);
		}
	}
}
