/**
 * In the name of Allah, the Beneficent, the Merciful.
 * @package shcalendar - The Calendar Related Extensions SH{Shamsi Hijri, Solar Hijri, Iranian Hijri}
 * @link http://git.akhi.ir/js/SHDate | https://github.com/md-akhi/SHCalendar-js#readme
 */
/**
 * class SHDate Language Persian
 */
// import SHDateLanguage_fa_IR from "shdate/lang/fa_IR";
export default class fa_IR {
	public static LANGUAGE: string = "fa_IR"; //Persion	fa
	public static IS_RTL: boolean = true;

	public static FIRST_DAY_OF_WEEK: number = 0; // first day of week for this locale; 0 = Satarday, 1 = Sunday, etc.

	public static GO_TODAY: string = "به امروز";

	public static TODAY: string = "امروز"; // appears in bottom bar

	public static WEEK_NAME: string = "هفته";

	public static WEEKEND: number | number[] = 6; //[5, 6]; // 0 = Satarday, 1 = Sunday, etc.

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

	public static MONTH_FULL_NAMES: string[] = [
		"فروردين",
		"ارديبهشت",
		"خرداد",
		"تير",
		"مرداد",
		"شهريور",
		"مهر",
		"آبان",
		"آذر",
		"دي",
		"بهمن",
		"اسفند"
	];

	public static MONTH_SHORT_NAMES: string[] = [
		"فرو",
		"ارد",
		"خرد",
		"تير",
		"مرد",
		"شهر",
		"مهر",
		"آبا",
		"آذر",
		"دي",
		"بهم‍",
		"اسف‍"
	];

	public static DAY_FULL_NAMES: string[] = [
		"شنبه",
		"يک‌‌شنبه",
		"دوشنبه",
		"سه‌ش‍‍‍‍نبه",
		"چهارشنبه",
		"پنج‌شنبه",
		"جمعه"
	];

	public static DAY_SHORT_NAMES: string[] = [
		"ش‍",
		"یک",
		"دو",
		"س‍ه",
		"چ‍هار",
		"پ‍نج",
		"ج‍"
	];
}
