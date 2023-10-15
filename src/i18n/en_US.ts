// import SHDateLanguage_en_US from "@md-akhi/shdatetime/en_US";
export default class en_US {
	//extend SHDateLanguage_en_US {
	static NAME: string = "English";
	static IS_RTL: boolean = false;

	static FIRST_DAY_OF_WEEK: number = 0; // first day of week for this locale; 0 = Satarday, 1 = Sunday, etc.

	static GO_TODAY: string = "Go Today";

	static TODAY: string = "Today"; // appears in bottom bar

	static WEEK_NAME: string = "wk";

	static WEEKEND: number | number[] = 6; //[5, 6]; // 0 = Satarday, 1 = Sunday, etc.

	static AM: string = "am"; //MERIDIEN_SHORT_NAMES
	static PM: string = "pm"; //MERIDIEN_SHORT_NAMES
	static MERIDIEN_SHORT_NAMES: string[] = ["AM", "PM"];

	static MONTH_FULL_NAMES: string[] = [
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

	static MONTH_SHORT_NAMES: string[] = [
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

	static DAY_FULL_NAMES: string[] = [
		"Saturday",
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday"
	];

	static DAY_SHORT_NAMES: string[] = [
		"Sat",
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri"
	];
}
