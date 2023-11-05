/**
 * In the name of Allah, the Beneficent, the Merciful.
 * @package shcalendar - The Calendar Related Extensions - SH (Solar Hijri, Shamsi Hijri, Iranian Hijri) (Solar Hijri, Shamsi Hijri, Iranian Hijri) (Solar Hijri, Shamsi Hijri, Iranian Hijri)
 * @author   Mohammad Amanalikhani
 * @copyright   Copyright (C) 2015 - 2022 Open Source Matters,Inc. All right reserved.
 * @license AGPL-3.0 License
 */
//import SHCalendar from "./index.js";
import SHDate from "shdate";
import SHCalendar from "./base.js";

export enum SelectionType {
	NONE = 0,
	SINGLE = 1,
	MULTIPLE = 2,
	WEEK = 3
}

export default class Selection {
	type: any;
	sel: any;
	onChange: Function;
	cal: any;

	constructor(
		selection: any[],
		selection_type: SelectionType,
		cal: SHCalendar
	) {
		this.type = selection_type;
		this.sel = selection instanceof Array ? selection : [selection];
		this.cal = cal;
		this.onChange = cal.inputField;
	}

	get() {
		return this.type == SHCalendar.SEL_SINGLE ? this.sel[0] : this.sel;
	}

	isEmpty() {
		return this.sel.length == 0;
	}

	set(
		date: SHDate | number | number[],
		is_select?: boolean,
		is_change?: boolean
	) {
		//arg, toggle)
		var type = this.type == SHCalendar.SEL_SINGLE;
		if (date instanceof Array) {
			this.sel = date;
			this.normalize();
			if (!is_change) this.onChange();
		} else {
			date = SHCalendar.dateToInt(date);
			if (type || !this.isSelected(date)) {
				if (type) this.sel = [date];
				else this.sel.splice(this.findInsertPos(date), 0, date);
				this.normalize();
				if (!is_change) this.onChange();
			} else if (is_select) this.unselect(date, is_change);
		}
	}

	reset(...args: any[]) {
		//arg, toggle)
		this.sel = [];
		this.set(args);
	}

	countDays() {
		var sel_item: any,
			date_first: SHDate,
			date_second: SHDate,
			count: number = 0,
			sel: number[] = this.sel;
		for (var i: number = sel.length - 1; i >= 0; i--, count++) {
			sel_item = sel[i];
			if (sel_item instanceof Array) {
				date_first = SHCalendar.intToDate(sel_item[0]);
				date_second = SHCalendar.intToDate(sel_item[1]);
				count += Math.round(
					Math.abs(date_second.getTime() - date_first.getTime()) / 864e5
				);
			}
		}
		return count;
	}

	unselect(date: SHDate | number, is_change: any) {
		//date)
		var bool: boolean,
			sel_item: any,
			sel: any,
			i: number,
			shdate: SHDate,
			day: number,
			shdate_second: SHDate;
		date = SHCalendar.dateToInt(date);
		bool = false;
		sel = this.sel;
		for (i = sel.length - 1; i >= 0; i--) {
			sel_item = sel[i];
			if (sel_item instanceof Array) {
				if (!(date < sel_item[0] || date > sel_item[1])) {
					shdate = SHCalendar.intToDate(date);
					day = shdate.getDate();
					if (date == sel_item[0]) {
						shdate.setDate(day + 1);
						sel_item[0] = SHCalendar.dateToInt(shdate);
						bool = true;
					} else if (date == sel_item[1]) {
						shdate.setDate(day - 1);
						sel_item[1] = SHCalendar.dateToInt(shdate);
						bool = true;
					} else {
						shdate_second = new SHDate(shdate);
						shdate_second.setDate(day + 1);
						shdate.setDate(day - 1);
						sel.splice(i + 1, 0, [
							SHCalendar.dateToInt(shdate_second),
							sel_item[1]
						]);
						sel_item[1] = SHCalendar.dateToInt(shdate);
						bool = true;
					}
				}
			} else if (date == sel_item) {
				sel.splice(i, 1);
				bool = true;
			}
		}
		if (bool) {
			this.normalize();
			if (!is_change) this.onChange();
		}
	}

	normalize() {
		var i: number,
			date: SHDate,
			date_int: any,
			sel: any,
			sel_item: any,
			sel_item_second: any,
			sel_item_first: any;
		this.sel = this.sel.sort(function (sel_first: any, sel_second: any) {
			if (sel_first instanceof Array) sel_first = sel_first[0];
			if (sel_second instanceof Array) sel_second = sel_second[0];
			return sel_first - sel_second;
		});
		sel = this.sel;
		for (i = sel.length - 1; i >= 0; i--) {
			sel_item_first = sel[i];
			if (sel_item_first instanceof Array) {
				if (sel_item_first[0] > sel_item_first[1]) {
					sel.splice(i, 1);
					continue;
				}
				if (sel_item_first[0] == sel_item_first[1])
					sel_item_first = sel[i] = sel_item_first[0];
			}
			if (sel_item) {
				date_int =
					sel_item_first instanceof Array ? sel_item_first[1] : sel_item_first;
				date = SHCalendar.intToDate(date_int);
				date.setDate(date.getDate() + 1);
				date_int = SHCalendar.dateToInt(date);
				if (sel_item < date_int) {
					sel_item_second = sel[i + 1];
					if (
						sel_item_first instanceof Array &&
						sel_item_second instanceof Array
					) {
						sel_item_first[1] = sel_item_second[1];
						sel.splice(i + 1, 1);
					} else if (sel_item_first instanceof Array) {
						sel_item_first[1] = sel_item;
						sel.splice(i + 1, 1);
					} else if (sel_item_second instanceof Array) {
						sel_item_second[0] = sel_item_first;
						sel.splice(i, 1);
					} else {
						sel[i] = [sel_item_first, sel_item_second];
						sel.splice(i + 1, 1);
					}
				}
			}
			sel_item =
				sel_item_first instanceof Array ? sel_item_first[0] : sel_item_first;
		}
	}

	findInsertPos(date: SHDate | number) {
		var sel_item: any,
			sel: any = this.sel,
			i: number = sel.length - 1;
		do {
			sel_item = sel[i--];
			if (sel_item instanceof Array) sel_item = sel_item[0];
		} while (i >= 0 && date < sel_item);
		return i + 1;
	}

	clear(nohooks: any) {
		//nohooks)
		this.sel = [];
		if (!nohooks) this.onChange();
	}

	selectRange(date_start: any | any[], date_end: any | any[]) {
		var checkRange: any;
		date_start = SHCalendar.dateToInt(date_start);
		date_end = SHCalendar.dateToInt(date_end);
		if (date_start > date_end) [date_end, date_start] = [date_start, date_end];
		checkRange = this.cal.args.checkRange;
		if (!checkRange) return this.#do_selectRange(date_start, date_end);
		try {
			this.cal.setFunction(
				new Selection(
					[[date_start, date_end]],
					SHCalendar.SEL_MULTIPLE,
					this.cal
				).getDates(false),
				(date: SHDate | number) => {
					if (this.cal.isDisabled(date))
						throw (
							(checkRange instanceof Function && checkRange(date, this), "OUT")
						);
				}
			);
			this.#do_selectRange(date_start, date_end);
		} catch (i) {}
	}

	#do_selectRange(date_start: any, date_end: any) {
		this.sel.push([date_start, date_end]);
		this.normalize();
		this.onChange();
	}

	isSelected(date: SHDate | number) {
		var sel: any, i: number;
		for (i = this.sel.length - 1; i >= 0; i--) {
			sel = this.sel[i];
			if (
				(sel instanceof Array && date >= sel[0] && date <= sel[1]) ||
				date == sel
			)
				return true;
		}
		return false;
	}

	getFirstDate() {
		var sel = this.sel[0];
		if (sel && sel instanceof Array) sel = sel[0];
		return sel;
	}

	getLastDate() {
		if (this.sel.length > 0) {
			var sel = this.sel[this.sel.length - 1];
			if (sel && sel instanceof Array) sel = sel[1];
			return sel;
		}
	}

	print(format: string, separator: string) {
		//format, separator)
		var sel: any,
			str: any[] = [],
			hours: number = this.cal.getHours(),
			minutes: number = this.cal.getMinutes();
		if (!separator) separator = " -> ";
		for (var i: number = 0; i < this.sel.length; i++) {
			sel = this.sel[i];
			if (sel instanceof Array)
				str.push(
					this.cal.printDate(
						SHCalendar.intToDate(sel[0], hours, minutes),
						format
					) +
						separator +
						this.cal.printDate(
							SHCalendar.intToDate(sel[1], hours, minutes),
							format
						)
				);
			else
				str.push(
					this.cal.printDate(SHCalendar.intToDate(sel, hours, minutes), format)
				);
		}
		return str;
	}

	getDates(str: any = "") {
		var date: SHDate,
			sel: any,
			string: any = [];
		for (var i = 0; i < this.sel.length; i++) {
			sel = this.sel[i];
			if (sel instanceof Array) {
				date = SHCalendar.intToDate(sel[0]);
				for (sel = sel[1]; SHCalendar.dateToInt(date) < sel; )
					string.push(str ? this.cal.printDate(date, str) : new SHDate(date)),
						date.setDate(date.getDate() + 1);
			} else date = SHCalendar.intToDate(sel);
			string.push(str ? this.cal.printDate(date, str) : date);
		}
		return string;
	}
}
