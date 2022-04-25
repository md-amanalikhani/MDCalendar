/**
 * In the name of Allah, the Beneficent, the Merciful.
 * @package The Calendar Related Extensions - SH (Solar Hijri, Shamsi Hijri, Iranian Hijri)
 * @author   Mohammad Amanalikhani
 * @copyright   Copyright (C) 2015 - 2022 Open Source Matters,Inc. All right reserved.
 * @license https://www.gnu.org/licenses/agpl-3.0.en.html AGPL-3.0 License
 */
import SHCalendar from "./shcalendar.js";

export default class Selection {
	type;
	sel;
	onChange;
	cal;

	constructor(selection: any, selectionType: any, inputField: any) {
		this.type = selectionType;
		this.sel = selection instanceof Array ? selection : [selection];
		this.onChange = SHCalendar.setEvent(inputField);
		this.cal = SHCalendar; //SHCalendar
	}

	get() {
		return this.type == SHCalendar.SEL_SINGLE ? this.sel[0] : this.sel;
	}
	isEmpty() {
		return this.sel.length == 0;
	}
	set(e: any, n: any, a: any) {
		//arg, toggle)
		var type = this.type == SHCalendar.SEL_SINGLE;
		e instanceof Array
			? ((this.sel = e), this.normalize(), a || this.onChange(this))
			: ((e = SHCalendar.dateToInt(e)),
			  type || !this.isSelected(e)
					? (type
							? (this.sel = [e])
							: this.sel.splice(this.findInsertPos(e), 0, e),
					  this.normalize(),
					  a || this.onChange(this))
					: n && this.unselect(e, a));
	}
	reset() {
		//arg, toggle)
		(this.sel = []), this.set.apply(this, arguments);
	}
	countDays() {
		var subSel,
			dateo,
			datet,
			count = 0,
			sel = this.sel;
		for (var i = sel.length; --i >= 0; )
			(subSel = sel[i]),
				subSel instanceof Array &&
					((dateo = SHCalendar.intToDate(subSel[0])),
					(datet = SHCalendar.intToDate(subSel[1])),
					(count += Math.round(
						Math.abs(datet.getTime() - dateo.getTime()) / 864e5
					))),
				++count;
		return count;
	}
	unselect(date: any, e: any) {
		//date)
		var bool, a, sel, i, datet, Date, Datet;
		(date = SHCalendar.dateToInt(date)), (bool = false), (sel = this.sel);
		for (i = sel.length; --i >= 0; )
			(a = sel[i]),
				a instanceof Array
					? date < a[0] ||
					  date > a[1] ||
					  ((datet = SHCalendar.intToDate(date)),
					  (Date = datet.getDate()),
					  date == a[0]
							? (datet.setDate(Date + 1),
							  (a[0] = SHCalendar.dateToInt(datet)),
							  (bool = true))
							: date == a[1]
							? (datet.setDate(Date - 1),
							  (a[1] = SHCalendar.dateToInt(datet)),
							  (bool = true))
							: ((Datet = new Date(datet)),
							  Datet.setDate(Date + 1),
							  datet.setDate(Date - 1),
							  sel.splice(i + 1, 0, [SHCalendar.dateToInt(Datet), a[1]]),
							  (a[1] = SHCalendar.dateToInt(datet)),
							  (bool = true)))
					: date == a && (sel.splice(i, 1), (bool = true));
		bool && (this.normalize(), e || this.onChange(this));
	}
	normalize() {
		var t, e, sel, a, s, i, r;
		this.sel = this.sel.sort(function (t, e) {
			return (
				t instanceof Array && (t = t[0]),
				e instanceof Array && (e = e[0]),
				t - e
			);
		});
		sel = this.sel;
		for (a = sel.length; --a >= 0; ) {
			if (((t = sel[a]), t instanceof Array)) {
				if (t[0] > t[1]) {
					sel.splice(a, 1);
					continue;
				}
				t[0] == t[1] && (t = sel[a] = t[0]);
			}
			e &&
				((s = e),
				(i = t instanceof Array ? t[1] : t),
				(i = SHCalendar.intToDate(i)),
				i.setDate(i.getDate() + 1),
				(i = SHCalendar.dateToInt(i)),
				s > i ||
					((r = sel[a + 1]),
					t instanceof Array && r instanceof Array
						? ((t[1] = r[1]), sel.splice(a + 1, 1))
						: t instanceof Array
						? ((t[1] = e), sel.splice(a + 1, 1))
						: r instanceof Array
						? ((r[0] = t), sel.splice(a, 1))
						: ((sel[a] = [t, r]), sel.splice(a + 1, 1)))),
				(e = t instanceof Array ? t[0] : t);
		}
	}
	findInsertPos(t: any) {
		var e,
			sel = this.sel,
			i;
		for (
			i = sel.length;
			--i >= 0 && ((e = sel[i]), e instanceof Array && (e = e[0]), t < e);

		);
		return i + 1;
	}
	clear(nohooks: any) {
		//nohooks)
		(this.sel = []), nohooks || this.onChange(this);
	}
	selectRange(start_date: any, end_date: any) {
		//start_date, end_date)
		var tmp, checkRange: any;
		(start_date = SHCalendar.dateToInt(start_date)),
			(end_date = SHCalendar.dateToInt(end_date)),
			start_date > end_date &&
				((tmp = start_date), (start_date = end_date), (end_date = tmp)),
			(checkRange = this.cal.args.checkRange);
		if (!checkRange) return this.#do_selectRange(start_date, end_date);
		try {
			setFunction(
				new Selection(
					[[start_date, end_date]],
					SHCalendar.SEL_MULTIPLE,
					Function()
				).getDates(),
				setEvent((t: any) => {
					if (this.isDisabled(t))
						throw (
							(checkRange instanceof Function && checkRange(t, this), "OUT")
						);
				}, this.cal)
			),
				this.#do_selectRange(start_date, end_date);
		} catch (i) {}
	}
	#do_selectRange(start_date: any, end_date: any) {
		this.sel.push([start_date, end_date]),
			this.normalize(),
			this.onChange(this);
	}
	isSelected(t: any) {
		var sel, i;
		for (i = this.sel.length; --i >= 0; ) {
			sel = this.sel[i];
			if ((sel instanceof Array && t >= sel[0] && t <= sel[1]) || t == sel)
				return true;
		}
		return false;
	}
	getFirstDate() {
		var sel = this.sel[0];
		sel && sel instanceof Array && (sel = sel[0]);
		return sel;
	}
	getLastDate() {
		if (this.sel.length > 0) {
			var sel = this.sel[this.sel.length - 1];
			sel && sel instanceof Array && (sel = sel[1]);
			return sel;
		}
	}
	print(format: any, separator: any) {
		//format, separator)
		var sel,
			str = [],
			Hours = this.cal.getHours(),
			Minutes = this.cal.getMinutes();
		separator || (separator = " -> ");
		for (var i = 0; i < this.sel.length; )
			(sel = this.sel[i++]),
				sel instanceof Array
					? str.push(
							SHCalendar.printDate(
								SHCalendar.intToDate(sel[0], Hours, Minutes),
								format
							) +
								separator +
								SHCalendar.printDate(
									SHCalendar.intToDate(sel[1], Hours, Minutes),
									format
								)
					  )
					: str.push(
							SHCalendar.printDate(
								SHCalendar.intToDate(sel, Hours, Minutes),
								format
							)
					  );
		return str;
	}
	getDates(str: any) {
		var date,
			sel,
			string = [];
		for (var i = 0; i < this.sel.length; ) {
			sel = this.sel[i++];
			if (sel instanceof Array) {
				date = SHCalendar.intToDate(sel[0]);
				for (sel = sel[1]; SHCalendar.dateToInt(date) < sel; )
					string.push(str ? SHCalendar.printDate(date, str) : new Date(date)),
						date.setDate(date.getDate() + 1);
			} else date = SHCalendar.intToDate(sel);
			string.push(str ? SHCalendar.printDate(date, str) : date);
		}
		return string;
	}
}
