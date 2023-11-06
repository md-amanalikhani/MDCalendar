import SHCalendar from "../src/base.js";

let cal = new SHCalendar();

console.log(
	SHCalendar.setup({
		cont: "SHcalendar-container",
		weekNumbers: true
	}),
	cal
);
