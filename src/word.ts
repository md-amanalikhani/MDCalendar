import Language_fa_IR from "./I18n/fa_IR.js";
import Language_en_US from "./I18n/en_US.js";

/**
 * list of supported languages
 * @since 1.0.0
 */
enum Language {
	fa_IR = "fa_IR",
	en_US = "en_US"
}
export default class Word {
	static LANGUAGE_WORD: string = Language.en_US;
	/**
	 * Get Language class
	 * @param {string} lang
	 * @return  string
	 * @since   1.0.0
	 */
	static checkLanguage(lang: string = Word.LANGUAGE_WORD) {
		switch (lang) {
			// Languages
			case Language.fa_IR:
				return Language.fa_IR;
			case Language.en_US:
				return Language.en_US;
			default:
				return Language.en_US;
		}
	}

	/**
	 * Get Language class
	 * @param {string} lang
	 * @return  string
	 * @since   1.0.0
	 */
	static getClassLanguage(lang: string = Word.LANGUAGE_WORD) {
		switch (lang) {
			// Languages
			case Language.fa_IR:
				return Language_fa_IR;
			case Language.en_US:
				return Language_en_US;
			default:
				return Language_en_US;
		}
	}

	/**
	 *
	 * @param   {int}  H24    numeric
	 * @param   {string}  LW    language    word
	 * @return  string  Ante/Post meridiem
	 * @since   1.0.0
	 */
	static isRTL(LW = Word.LANGUAGE_WORD): boolean {
		const cls = Word.getClassLanguage(LW);
		return cls.IS_RTL;
	}

	/**
	 *
	 * @param   {int}  H24    numeric
	 * @param   {string}  LW    language    word
	 * @return  string  Ante/Post meridiem
	 * @since   1.0.0
	 */
	static getFirstDayOfWeek(LW = Word.LANGUAGE_WORD): number {
		const cls = Word.getClassLanguage(LW);
		return cls.FIRST_DAY_OF_WEEK;
	}
	static getWeekend(LW = Word.LANGUAGE_WORD): number | number[] {
		const cls = Word.getClassLanguage(LW);
		return cls.WEEKEND;
	}
	static getWeekName(LW = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(LW);
		return cls.WK;
	}

	static getGoToday(LW = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(LW);
		return ";";
	}
	static getToday(LW = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(LW);
		return ";";
	}
	static getAM(LW = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(LW);
		return ";";
	}
	static getPM(LW = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(LW);
		return ";";
	}
	static getMonthName(LW = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(LW);
		return ";";
	}
	static getShortMonthName(LW = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(LW);
		return ";";
	}
	static getDayName(LW = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(LW);
		return ";";
	}
	static getshortDayName(LW = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(LW);
		return ";";
	}
}
