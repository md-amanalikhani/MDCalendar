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
		return Word.getClass(word_language).IS_RTL;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getFirstDayOfWeek(word_language: string = Word.LANGUAGE_WORD): number {
		return Word.getClass(word_language).FIRST_DAY_OF_WEEK;
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
		return Word.getClass(word_language).WEEKEND;
	}

	/**
	 *
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getWeekName(word_language: string = Word.LANGUAGE_WORD): string {
		return Word.getClass(word_language).WEEK_NAME;
	}

	/**
	 * A full textual go to the today
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getGoToday(word_language: string = Word.LANGUAGE_WORD): string {
		return Word.getClass(word_language).GO_TODAY;
	}

	/**
	 * A full textual the today
	 * @param {string} word_language language word
	 * @return string Ante/Post meridiem
	 * @since 1.0.0
	 */
	static getToday(word_language: string = Word.LANGUAGE_WORD): string {
		return Word.getClass(word_language).TODAY;
	}

	/**
	 * Uppercase Ante meridiem and Post meridiem
	 * @param {number} H24 numeric of hours
	 * @param {string} word_language word language
	 * @return string Ante/Post meridiem
	 */
	static getMeridienFullName(
		H24: number,
		word_language: string = Word.LANGUAGE_WORD
	): string {
		return Word.getClass(word_language).MERIDIEN_FULL_NAMES[H24 > 11 ? 1 : 0];
	}

	/**
	 * Lowercase Ante meridiem and Post meridiem, two letters
	 * @param {number} H24 numeric of hours
	 * @param {string} word_language word language
	 * @return {string} Ante/Post meridiem, two letters
	 */
	static getMeridienShortName(
		H24: number,
		word_language: string = Word.LANGUAGE_WORD
	): string {
		return Word.getClass(word_language).MERIDIEN_SHORT_NAMES[H24 > 11 ? 1 : 0];
	}

	/**
	 * A full textual representation of a month
	 * @param {number} month numeric of a month
	 * @param {string} word_language word language
	 * @return {string} A full textual of a month
	 */
	static getMonthFullName(
		month: number,
		word_language: string = Word.LANGUAGE_WORD
	): string {
		return Word.getClass(word_language).MONTH_FULL_NAMES[month];
	}

	/**
	 * A short textual representation of a month, three letters
	 * @param {number} month numeric of a month
	 * @param {string} word_language word language
	 * @return {string} A short textual of a month, three letters
	 */
	static getMonthShortName(
		month: number,
		word_language: string = Word.LANGUAGE_WORD
	): string {
		return Word.getClass(word_language).MONTH_SHORT_NAMES[month];
	}

	/**
	 * A full textual representation of the day of the week
	 * @param {number} dow numeric of the day of the week
	 * @param {string} word_language word language
	 * @param {number} FDOW numeric of the first day of the week
	 * @return {string} A full textual the day of the week
	 */
	static getDayFullName(
		dow: number,
		word_language: string = Word.LANGUAGE,
		FDOW: number = Word.FIRST_DAY_OF_WEEK
	): string {
		return Word.getClass(word_language).DAY_FULL_NAMES[dow];
	}

	/**
	 * A short textual representation of the day of the week, three letters
	 * @param {number} dow numeric of the day of the week
	 * @param {string} word_language word language
	 * @param {number} FDOW numeric of the first day of the week
	 * @return {string} A short textual of a day, three letters
	 */
	static getDayShortName(
		dow: number,
		word_language: string = Word.LANGUAGE,
		FDOW: number = Word.FIRST_DAY_OF_WEEK
	): string {
		return Word.getClass(word_language).DAY_SHORT_NAMES[dow];
	}
}
