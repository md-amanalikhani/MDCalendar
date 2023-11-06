import Language, { Languages } from "./languages/language.js";

/**
 * list of supported languages
 * @since 1.0.0
 */
export default class Word extends Language {
	static LANGUAGE_WORD: string = Languages.en_US;
	static FIRST_DAY_OF_WEEK: number = 0;

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static isRTL(word_language: string = Word.LANGUAGE_WORD): boolean {
		const cls = Word.getClass(word_language);
		return cls.IS_RTL;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getFirstDayOfWeek(word_language: string = Word.LANGUAGE_WORD): number {
		const cls = Word.getClass(word_language);
		return cls.FIRST_DAY_OF_WEEK;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getWeekend(
		word_language: string = Word.LANGUAGE_WORD
	): number | number[] {
		const cls = Word.getClass(word_language);
		return cls.WEEKEND as number | number[];
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getWeekName(word_language: string = Word.LANGUAGE_WORD): string {
		const cls = Word.getClass(word_language);
		return cls.WEEK_NAME;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getGoToday(word_language: string = Word.LANGUAGE_WORD): string {
		const cls = Word.getClass(word_language);
		return cls.GO_TODAY;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getToday(word_language: string = Word.LANGUAGE_WORD): string {
		const cls = Word.getClass(word_language);
		return cls.TODAY;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getAM(word_language: string = Word.LANGUAGE_WORD): string {
		const cls = Word.getClass(word_language);
		return cls.AM;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getPM(word_language: string = Word.LANGUAGE_WORD): string {
		const cls = Word.getClass(word_language);
		return cls.PM;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getMonthName(word_language: string = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClass(word_language);
		return cls.MONTH_FULL_NAMES;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getShortMonthName(
		word_language: string = Word.LANGUAGE_WORD
	): string[] {
		const cls = Word.getClass(word_language);
		return cls.MONTH_SHORT_NAMES;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getDayName(word_language: string = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClass(word_language);
		return cls.DAY_FULL_NAMES;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getshortDayName(word_language: string = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClass(word_language);
		return cls.DAY_SHORT_NAMES;
	}
}
