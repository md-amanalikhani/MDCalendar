export default class fa_IR {
	static NAME: string = "Persion";
	static IS_RTL: boolean = true;

	static FIRST_DAY_OF_WEEK: number = 1; // first day of week for this locale; 0 = Sunday, 1 = Monday, etc.

	static GO_TODAY: string = "به امروز";

	static TODAY: string = "امروز"; // appears in bottom bar

	static WEEK_NAME: string = "هفته";

	static WEEKEND: number | number[] = 6; // 0 = Sunday, 1 = Monday, etc.

	static AM: string = "am";

	static PM: string = "pm";

	static MONTH_NAME: string[] = [
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

	static SHORT_MONTH_NAME: string[] = [
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

	static DAY_NAME: string[] = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	];

	static SHORT_DAY_NAME: string[] = [
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
