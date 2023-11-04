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
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static isRTL(language_word = Word.LANGUAGE_WORD): boolean {
		const cls = Word.getClass(language_word);
		return cls.IS_RTL;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getFirstDayOfWeek(language_word = Word.LANGUAGE_WORD): number {
		const cls = Word.getClass(language_word);
		return cls.FIRST_DAY_OF_WEEK;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getWeekend(language_word = Word.LANGUAGE_WORD): number | number[] {
		const cls = Word.getClass(language_word);
		return cls.WEEKEND as number | number[];
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getWeekName(language_word = Word.LANGUAGE_WORD): string {
		const cls = Word.getClass(language_word);
		return cls.WEEK_NAME;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getGoToday(language_word = Word.LANGUAGE_WORD): string {
		const cls = Word.getClass(language_word);
		return cls.GO_TODAY;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getToday(language_word = Word.LANGUAGE_WORD): string {
		const cls = Word.getClass(language_word);
		return cls.TODAY;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getAM(language_word = Word.LANGUAGE_WORD): string {
		const cls = Word.getClass(language_word);
		return cls.AM;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getPM(language_word = Word.LANGUAGE_WORD): string {
		const cls = Word.getClass(language_word);
		return cls.PM;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getMonthName(language_word = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClass(language_word);
		return cls.MONTH_FULL_NAMES;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getShortMonthName(language_word = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClass(language_word);
		return cls.MONTH_SHORT_NAMES;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getDayName(language_word = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClass(language_word);
		return cls.DAY_FULL_NAMES;
	}

	/**
	 *
	 * @param {string} language_word language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getshortDayName(language_word = Word.LANGUAGE_WORD): string[] {
		const cls = Word.getClass(language_word);
		return cls.DAY_SHORT_NAMES;
	}
}
