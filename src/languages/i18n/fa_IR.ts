/**
 * In the name of Allah, the Beneficent, the Merciful.
 * @package shcalendar - The Calendar Related Extensions SH{Solar Hijri, Shamsi Hijri, Iranian Hijri}
 * @link http://git.akhi.ir/js/SHDate | https://github.com/md-akhi/SHCalendar-js#readme
 */
/**
 * class SHDate Language Persian
 */
// import SHDateLanguage_fa_IR from "shdate/lang/fa_IR";
export default class fa_IR {
	public static LANGUAGE: string = "fa_IR"; //Persion	fa
	public static IS_RTL: boolean = true;

	public static FIRST_DAY_OF_WEEK: number = 1; // first day of week for this locale; 0 = Sunday, 1 = Monday, etc.

	public static GO_TODAY: string = "به امروز";

	public static TODAY: string = "امروز"; // appears in bottom bar

	public static WEEK_NAME: string = "هفته";

	public static WEEKEND: number | number[] = 6; // 0 = Sunday, 1 = Monday, etc.

	public static AM: string = "am";
	public static AM_LONG: string = "بعد از ظهر";
	public static AM_SHORT: string = "ب‍.ظ";

	public static PM: string = "pm";
	public static PM_LONG: string = "قبل از ظهر";
	public static PM_SHORT: string = "ق‍.ظ";

	public static SUFFIX: string = "ام";

	public static MERIDIEN_FULL_NAMES: string[] = ["قبل از ظهر", "بعد از ظهر"];

	public static MERIDIEN_SHORT_NAMES: string[] = ["ق‍.ظ", "ب‍.ظ"];

	public static DIGIT: string[] = [
		"٠",
		"١",
		"٢",
		"٣",
		"۴",
		"۵",
		"۶",
		"٧",
		"٨",
		"٩",
		","
	];

	public static DIGIT2: string[] = [
		"٠",
		"١",
		"٢",
		"٣",
		"٤",
		"٥",
		"٦",
		"٧",
		"٨",
		"٩",
		","
	];
	public static MONTH_FULL_NAMES: string[] = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	public static MONTH_SHORT_NAMES: string[] = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];

	public static DAY_FULL_NAMES: string[] = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	];

	public static DAY_SHORT_NAMES: string[] = [
		"Su",
		"Mo",
		"Tu",
		"We",
		"Th",
		"Fr",
		"Sa",
		"Su"
	];
}
