/**
 * In the name of Allah, the Beneficent, the Merciful.
 * @package shcalendar - The Calendar Related Extensions SH{Shamsi Hijri, Solar Hijri, Iranian Hijri}
 * @link http://git.akhi.ir/js/SHDate | https://github.com/md-akhi/SHCalendar-js#readme
 */
/**
 * class SHDate Language English
 */
// import SHDateLanguage_en_US from "shdate/lang/en_US";
export default class en_US {
	//extend SHDateLanguage_en_US {
	public static LANGUAGE = "en_US"; //English	en
	public static IS_RTL: boolean = false;

	public static FIRST_DAY_OF_WEEK: number = 0; // first day of week for this locale; 0 = Satarday, 1 = Sunday, etc.

	public static GO_TODAY: string = "Go Today";

	public static TODAY: string = "Today"; // appears in bottom bar

	public static WEEK_NAME: string = "wk";

	public static WEEKEND: number | number[] = 6; //[5, 6]; // 0 = Satarday, 1 = Sunday, etc.

	public static MERIDIEN_FULL_NAMES: string[] = ["AM", "PM"];
	public static MERIDIEN_SHORT_NAMES = ["am", "pm"];

	public static MONTH_FULL_NAMES: string[] = [
		"Farvardin",
		"Ordibehesht",
		"Khordad",
		"Tir",
		"Amordad",
		"Shahrivar",
		"Mehr",
		"Aban",
		"Azar",
		"Dey",
		"Bahman",
		"Esfand"
	];

	public static MONTH_SHORT_NAMES: string[] = [
		"Far",
		"Ord",
		"Kho",
		"Tir",
		"Amo",
		"Sha",
		"Meh",
		"Aba",
		"Aza",
		"Dey",
		"Bah",
		"Esf"
	];

	public static DAY_FULL_NAMES: string[] = [
		"Saturday",
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday"
	];

	public static DAY_SHORT_NAMES: string[] = [
		"Sat",
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri"
	];

	public static DIGIT: string[] = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"."
	];
}
