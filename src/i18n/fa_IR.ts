export default class fa_IR {
	static NAME: string = "Persion";
	static IS_RTL: boolean = true;

	static FIRST_DAY_OF_WEEK: number = 1; // first day of week for this locale; 0 = Sunday, 1 = Monday, etc.

	static GO_TODAY: string = "به امروز";

	static TODAY: string = "امروز"; // appears in bottom bar

	static WEEK_NAME: string = "هفته";

	static WEEKEND: number | number[] = 6; // 0 = Sunday, 1 = Monday, etc.

	static AM: string = "am";
	static AM_LONG: string = "بعد از ظهر";
	static AM_SHORT: string = "ب‍.ظ";

	static PM: string = "pm";
	static PM_LONG: string = "قبل از ظهر";
	static PM_SHORT: string = "ق‍.ظ";

	static MONTH_FULL_NAMES: string[] = [
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

	static MONTH_SHORT_NAMES: string[] = [
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

	static DAY_FULL_NAMES: string[] = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	];

	static DAY_SHORT_NAMES: string[] = [
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
