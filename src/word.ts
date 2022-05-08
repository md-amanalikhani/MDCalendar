import Language_fa_IR from "./i18n/fa_IR.js";
import Language_en_US from "./i18n/en_US.js";

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
	static FIRST_DAY_OF_WEEK: number = 0;
	/**
	 * cheeck Language
	 * @param {string} language
	 * @return string
	 * @since 1.0.0
	 */
	static checkLanguage(language: string = Word.LANGUAGE_WORD): boolean {
		switch (language) {
			case Language.fa_IR:
			case Language.en_US:
				return true;
			default:
				return false;
		}
	}

	/**
	 * Get Language class
	 * @param {string} language
	 * @return string
	 * @since 1.0.0
	 */
	static getClassLanguage(language: string = Word.LANGUAGE_WORD): any {
		switch (language) {
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
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static isRTL(language_word = Word.LANGUAGE_WORD): boolean {
		const cls = Word.getClassLanguage(language_word);
		return cls.IS_RTL;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getFirstDayOfWeek(language_word = Word.LANGUAGE_WORD): number {
		const cls = Word.getClassLanguage(language_word);
		return cls.FIRST_DAY_OF_WEEK;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getWeekend(language_word = Word.LANGUAGE_WORD): number | number[] {
		const cls = Word.getClassLanguage(language_word);
		return cls.WEEKEND as number | number[];
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getWeekName(language_word = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(language_word);
		return cls.WEEK_NAME;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getGoToday(language_word = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(language_word);
		return cls.GO_TODAY;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getToday(language_word = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(language_word);
		return cls.TODAY;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getAM(language_word = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(language_word);
		return cls.AM;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getPM(language_word = Word.LANGUAGE_WORD): string {
		const cls = Word.getClassLanguage(language_word);
		return cls.PM;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getMonthName(language_word = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClassLanguage(language_word);
		return cls.MONTH_NAME;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getShortMonthName(language_word = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClassLanguage(language_word);
		return cls.SHORT_MONTH_NAME;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getDayName(language_word = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClassLanguage(language_word);
		return cls.DAY_NAME;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getshortDayName(language_word = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClassLanguage(language_word);
		return cls.SHORT_DAY_NAME;
	}
}
