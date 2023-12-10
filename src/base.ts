/**
 * In the name of Allah, the Beneficent, the Merciful.
 * @package shcalendar - The Calendar Related Extensions SH{Shamsi Hijri, Solar Hijri, Iranian Hijri}
 * @author   Mohammad Amanalikhani
 * @link    http://docs.akhi.ir/js/SHCalendar
 * @copyright   Copyright (C) 2015 - 2022 . All right reserved.
 * @license AGPL-3.0 License
 * @version Release: 1.0.0
 */
import Word from "./word.js";
import Selection from "./selection.js";
import SHDate from "shdate";

class SHDateCalendar extends SHDate {
	constructor(...args: any) {
		super(args);
	}
	tomorrow() {
		this.setTime(SHDate.now());
		this.nextDate();
	}
	today() {
		this.setTime(SHDate.now());
	}
	yesterday() {
		this.setTime(SHDate.now());
		this.prevDate();
	}
	nextDate() {
		this.setDate(this.getDate() + 1);
	}
	prevDate() {
		this.setDate(this.getDate() - 1);
	}
	nextMonth() {
		this.setMonth(this.getMonth() + 1);
	}
	prevMonth() {
		this.setMonth(this.getMonth() - 1);
	}
	nextWeek() {
		const [iy, iw] = this.getWeekOfYear();
		this.setWeek(iy, iw + 1);
	}
	prevWeek() {
		const [iy, iw] = this.getWeekOfYear();
		this.setWeek(iy, iw - 1);
	}
	nextYear() {
		this.setFullYear(this.getFullYear() + 1);
	}
	prevYear() {
		this.setFullYear(this.getFullYear() - 1);
	}
	setDay(day: number) {
		this.getDay();
		this.setDate(6 - day - 6 - this.getDay() + this.getDate());
	}
	nextDay() {
		this.setDay(this.getDay() + 1);
	}
	prevDay() {
		this.setDay(this.getDay() - 1);
	}
}
export default class SHCalendar {
	static VERSION: string = "1.0.0";
	static IS_OPERA = /opera/i.test(navigator.userAgent);
	static IS_KHTML = /Konqueror|Safari|KHTML/i.test(navigator.userAgent);
	static IS_IE =
		/msie/i.test(navigator.userAgent) &&
		!SHCalendar.IS_OPERA &&
		!/mac_powerpc/i.test(navigator.userAgent);
	static IS_IE6 = SHCalendar.IS_IE && /msie 6/i.test(navigator.userAgent);
	static IS_GECKO =
		/gecko/i.test(navigator.userAgent) &&
		!SHCalendar.IS_KHTML &&
		!SHCalendar.IS_OPERA &&
		!SHCalendar.IS_IE;

	#table_config: any = " align='center' cellspacing='0' cellpadding='0'"; //Q

	#top_class: any = {
		//Z
		"SHCalendar-topCont": "topCont",
		"SHCalendar-focusLink": "focusLink",
		SHCalendar: "main",
		"SHCalendar-topBar": "topBar",
		"SHCalendar-title": "title",
		"SHCalendar-dayNames": "dayNames",
		"SHCalendar-body": "body",
		"SHCalendar-menu": "menu",
		"SHCalendar-menu-year": "yearInput",
		"SHCalendar-bottomBar": "bottomBar",
		"SHCalendar-tooltip": "tooltip",
		"SHCalendar-time-hour": "timeHour",
		"SHCalendar-time-minute": "timeMinute",
		"SHCalendar-time-am": "timeAM",
		"SHCalendar-navBtn SHCalendar-prevYear": "navPrevYear",
		"SHCalendar-navBtn SHCalendar-nextYear": "navNextYear",
		"SHCalendar-navBtn SHCalendar-prevMonth": "navPrevMonth",
		"SHCalendar-navBtn SHCalendar-nextMonth": "navNextMonth"
	};

	#control_button: any = {
		// te
		"-3": "backYear",
		"-2": "back",
		0: "now",
		2: "fwd",
		3: "fwdYear"
	};

	#control_key: any = {
		//ee
		37: -1,
		38: -2,
		39: 1,
		40: 2
	};

	#ne: any = {
		33: -1,
		34: 1
	};

	#func_animation = {
		//ae
		elastic_b: function (pos: number) {
			return 1 - Math.cos(5.5 * -pos * Math.PI) / Math.pow(2, 7 * pos);
		},
		magnetic: function (pos: number) {
			return 1 - Math.cos(10.5 * pos * pos * pos * Math.PI) / Math.exp(4 * pos);
		},
		accel_b: function (pos: number) {
			pos = 1 - pos;
			return 1 - pos * pos * pos * pos;
		},
		accel_a: function (pos: number) {
			return pos * pos * pos;
		},
		accel_ab: function (pos: number) {
			pos = 1 - pos;
			return 1 - Math.sin((pos * pos * Math.PI) / 2);
		},
		accel_ab2: function (pos: number) {
			pos /= 0.5;
			if (pos < 1) return 0.5 * pos * pos;
			return -0.5 * (--pos * (pos - 2) - 1);
		},
		brakes: function (pos: number) {
			pos = 1 - pos;
			return 1 - Math.sin(pos * pos * Math.PI);
		},
		shake: function (pos: number) {
			if (0.5 > pos) return -Math.cos(11 * pos * Math.PI) * pos * pos;
			pos = 1 - pos;
			return Math.cos(11 * pos * Math.PI) * pos * pos;
		}
	};

	static SEL_NONE: number = Selection.SELECTION_TYPE.NONE;
	static SEL_SINGLE: number = Selection.SELECTION_TYPE.SINGLE;
	static SEL_MULTIPLE: number = Selection.SELECTION_TYPE.MULTIPLE;
	static SEL_WEEK: number = Selection.SELECTION_TYPE.WEEK;

	args: any;
	handlers: any = {};
	lang: string = SHCalendar.DEFAULT_ARGS.lang;
	fdow: number = Word.getFirstDayOfWeek(this.lang);
	date: SHDate;
	time: any;
	selection: any;
	els: any = {};
	body_animation: any;
	menu_visible: any;
	bluring_time_out: any;
	focused: any;
	menu_animation: any;
	events_focusing: any;
	sel_range_start: any;
	_mouseDiff: any;
	first_date_visible: any = false;
	last_date_visible: any = false;
	last_hover_date: any = false;
	show_animation: any;
	date_format: any;
	input_field: any;
	static kcmonth: any;
	static DEFAULT_ARGS = {
		cont: null,
		lang: "en_US",
		date: new SHDate(),
		dateFormat: "%Y-%m-%d",
		fdow: Word.getFirstDayOfWeek(),
		weekNumbers: false,
		bottomBar: true,
		showTime: false,
		time: true,
		timePos: "right",
		minuteStep: 5,
		titleFormat: "%b %Y",
		checkRange: false,
		min: false,
		max: false,
		animation: !SHCalendar.IS_IE6,
		opacity: SHCalendar.IS_IE ? 1 : 3,
		input_field: false,
		trigger: false,
		align: "Bl/ / /T/r",
		multiCtrl: true,
		fixed: false,
		reverseWheel: false,
		selection: [],
		selectionType: SHCalendar.SEL_MULTIPLE,
		noScroll: false,
		disabled: Function(),
		dateInfo: Function(),
		onChange: Function(),
		onSelect: Function(),
		onTimeChange: Function(),
		onFocus: Function(),
		onBlur: Function(),
		onClose: Function()
	};

	constructor(args: any = SHCalendar.DEFAULT_ARGS) {
		this.args = this.dataIntegration(args, SHCalendar.DEFAULT_ARGS);
		this.date = this.setDate(this.args.date);
		this.args.min = this.setDate(this.args.min);
		this.args.max = this.setDate(this.args.max);
		if (this.args.time === true)
			this.time =
				this.date.getHours() * 1e2 +
				Math.trunc(this.date.getMinutes() / this.args.minuteStep) *
					this.args.minuteStep;
		this.fdow = this.args.fdow;
		this.lang = this.args.lang;
		this.setHandler();
		this.selection = new Selection(
			this.args.selection,
			this.args.selectionType,
			this
		);
		this.init();
		if (this.args.trigger)
			this.manageFields(
				this.args.trigger,
				this.args.input_field,
				this.args.dateFormat
			); //popup
	}

	dataIntegration(data: any, defaults: any): any {
		return { ...defaults, ...data };
	}

	getElementById(el: HTMLElement | string): HTMLElement {
		if (typeof el == "string")
			return document.getElementById(el) as HTMLElement;
		else if (el instanceof HTMLElement) return el;
		return document.createElement("shcalendar");
	}

	setDate(date: SHDate | string | number) {
		if (typeof date == "number") return SHCalendar.intToDate(date);
		if (typeof date == "string") {
			const [year, month, day] = date.split(/-/);
			return new SHDate(+year, +month - 1, +day, 12);
		}
		return date;
	}

	setHandler() {
		const event: Array<string> = [
			"onChange",
			"onSelect",
			"onTimeChange",
			"onFocus",
			"onBlur",
			"onClose"
		];
		for (const key in event) {
			const evn: any = event[key];
			this.handlers[key] = Array.isArray(evn) ? evn : [evn];
		}
	}

	init(): HTMLElement {
		const { cont: args_cont, noScroll: args_noScroll } = this.args,
			tis = this;
		var el = this.getElementById(args_cont);
		el.innerHTML = this.template();
		this.setNode(el.firstChild, (el: any) => {
			var class_name = this.#top_class[el.className];
			if (class_name) tis.els[class_name] = el;
			if (SHCalendar.IS_IE) el.setAttribute("unselectable", "on");
		});
		const {
			topCont: els_top_cont,
			main: els_main,
			focusLink: els_focus_link,
			yearInput: els_year_input
		} = this.els;
		const events: any = {
			mousedown: (event: MouseEvent) => this.mouseClick(event, true),
			mouseup: (event: MouseEvent) => this.mouseClick(event, false),
			mouseover: (event: MouseEvent) => this.mouseHover(event, true),
			mouseout: (event: MouseEvent) => this.mouseHover(event, false),
			keypress: (event: KeyboardEvent) => this.keypress(event)
		};
		const events_IE: any = SHCalendar.IS_IE
			? {
					dblclick: events.mousedown,
					keydown: events.keypress
			  }
			: {};
		const events_wheel: any = !args_noScroll
			? SHCalendar.IS_GECKO
				? {
						DOMMouseScroll: (event: any) => this.wheelCHTime(event)
				  }
				: {
						mousewheel: (event: any) => this.wheelCHTime(event)
				  }
			: {};
		this.addEvent(els_main, { ...events, ...events_IE, ...events_wheel });
		this.events_focusing = {
			focus: (event?: MouseEvent) => tis.onFocus(),
			blur: (event?: MouseEvent) => tis.onBluringTimeout()
		};
		this.addEvent(els_focus_link, this.events_focusing);
		if (els_year_input) this.addEvent(els_year_input, this.events_focusing);

		this.setTime(this.time, true);
		this.moveTo(this.date, false);
		return els_top_cont;
	}

	createElement(type: any, className?: any, parent?: any) {
		const el: HTMLElement = document.createElementNS
			? document.createElementNS("http://www.w3.org/1999/xhtml", type)
			: document.createElement(type);
		if (className) el.className = className;
		if (parent) parent.appendChild(el);
		return el;
	}

	addEvent(el: any, evname: any, callback?: any, useCapture: boolean = false) {
		var i: number | string;
		if (Array.isArray(el))
			for (const _el of el) this.addEvent(_el, evname, callback, useCapture);
		else if (typeof evname == "object")
			for (const eventName of Object.keys(evname))
				this.addEvent(el, eventName, evname[eventName], useCapture);
		else {
			if (el.addEventListener)
				el.addEventListener(evname, callback, useCapture);
			else if (el.attachEvent) el.attachEvent("on" + evname, callback);
			else el["on" + evname] = callback;
		}
	}

	removeEvent(
		el: any,
		evname: any,
		callback?: any,
		useCapture: boolean = false
	) {
		if (Array.isArray(el))
			for (const _el of el) this.removeEvent(_el, evname, callback, useCapture);
		else if (typeof evname == "object") {
			for (const eventName of Object.keys(evname))
				this.removeEvent(el, eventName, evname[eventName], callback);
		} else {
			if (el.removeEventListener) {
				el.removeEventListener(evname, callback, useCapture);
				//
			} else if (el.detachEvent) {
				el.detachEvent("on" + evname, callback);
			} else {
				el["on" + evname] = null;
			}
		}
	}

	stopEvent(event: Event) {
		if (event.cancelable) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			// For IE
			event.cancelBubble = true;
			event.returnValue = false;
		}
		return false;
	}

	addEventListener(evname: string, func: (event: any) => void) {
		if (!this.handlers[evname]) {
			this.handlers[evname] = [];
		}
		this.handlers[evname].push(func);
	}

	removeEventListener(evname: string, func: Function) {
		const evn = this.handlers[evname];
		for (var i = evn.length - 1; i >= 0; i--)
			if (evn[i] === func) {
				evn.splice(i, 1);
				return;
			}
	}

	setNode(els: any, callback: (el: HTMLElement) => any) {
		if (!callback(els))
			for (let el = els.firstChild; el; el = el.nextSibling)
				if (el.nodeType == 1) this.setNode(el, callback);
	}

	mouseClick(event: MouseEvent | any, io: boolean) {
		var _time_out: any, events: any, el_date: any;
		const el_type = this.getAttributeType(event);
		if (el_type && !el_type.getAttribute("disabled")) {
			const shc_type = el_type.getAttribute("shc-type");
			const shc_btn = el_type.getAttribute("shc-btn");
			if (io) {
				const shc_date = el_type.getAttribute("shc-date");
				const tis = this;
				events = {
					mouseover: (event: any) => tis.stopEvent(event),
					mousemove: (event: any) => tis.stopEvent(event),
					mouseup: (event?: any) => {
						const shc_cls = el_type.getAttribute("shc-cls");
						if (shc_cls) tis.removeClass(el_type, tis.getClass(shc_cls, 1));
						clearTimeout(_time_out);
						tis.removeEvent(document, events, true);
						events = null;
					}
				};
				setTimeout(() => tis.focusingFocus(), 1);
				const shc_cls = el_type.getAttribute("shc-cls");
				if (shc_cls) this.addClass(el_type, this.getClass(shc_cls, 1));
				if ("menu" == shc_btn) {
					this.toggleMenu();
				} else if (el_type && /^[+-][MY]$/.test(shc_btn)) {
					if (this.stepDate(shc_btn)) {
						_time_out = (type: string = shc_type) => {
							if (tis.stepDate(type, true)) {
								_time_out = setTimeout(_time_out(type), 40);
							} else {
								events.mouseup();
								tis.stepDate(type);
							}
						};
						_time_out = setTimeout(_time_out(shc_btn), 350);
						this.addEvent(document, events, true);
					} else events.mouseup();
				} else if ("year" == shc_btn) {
					this.els.yearInput.focus();
					this.els.yearInput.select();
				} else if ("time-am" == shc_type) {
					this.addEvent(document, events, true);
				} else if (/^time/.test(shc_type)) {
					_time_out = (type: string = shc_type) => {
						tis.stepTime(type);
						_time_out = setTimeout(_time_out(type), 1e2);
					};
					this.stepTime(shc_type);
					_time_out = setTimeout(_time_out(shc_type), 350);
					this.addEvent(document, events, true);
				} else {
					if (shc_date && this.selection.type) {
						const selection = this.selection;
						if (selection.type == SHCalendar.SEL_MULTIPLE) {
							if (event.shiftKey && this.sel_range_start) {
								selection.selectRange(this.sel_range_start, shc_date);
							} else if (
								event.ctrlKey ||
								selection.isSelected(shc_date) ||
								!this.args.multiCtrl
							) {
								selection.clear(true);
								selection.set(shc_date, true);
								this.sel_range_start = shc_date;
							}
						} else {
							selection.set(shc_date);
							this.moveTo(SHCalendar.intToDate(shc_date), 2);
						}
						el_date = this.getElementDate(shc_date);
						this.mouseHover({ target: el_date }, true);
					}
					this.addEvent(document, events, true);
				}
				if (SHCalendar.IS_IE && events && events && /dbl/i.test(event.type)) {
					events.mouseup();
				}
				if (
					!(
						this.args.fixed ||
						!/^(SHCalendar-(topBar|bottomBar|weekend|weekNumber|menu(-sep)?))?$/.test(
							el_date.className
						) ||
						this.args.cont
					)
				) {
					this._mouseDiff = this.getOffset(
						event,
						this.getElementOffset(this.els.topCont)
					);
					this.addEvent(document, events, true);
				}
			} else if ("today" == shc_btn) {
				const date = new SHDate();
				if (
					!(this.menu_visible || this.selection.type != SHCalendar.SEL_SINGLE)
				)
					this.selection.set(date);
				this.moveTo(date, true);
				this.showMenu(false);
			} else if (/^m([0-9]+)/.test(shc_btn)) {
				const date = this.date.clone();
				date.setFullYear(
					this._getInputYear(),
					+shc_btn.replace(/^m([0-9]+)/, "$1"),
					1
				);
				this.moveTo(date, true);
				this.showMenu(false);
			} else if ("time-am" == shc_type) {
				this.setHours(this.date.getHours() + 12);
			}
			if (!SHCalendar.IS_IE) this.stopEvent(event);
		}
	}

	mouseHover(event: MouseEvent | any, io: boolean) {
		const el_type = this.getAttributeType(event);
		if (el_type) {
			const shc_type = el_type.getAttribute("shc-type");
			if (shc_type && !el_type.getAttribute("disabled")) {
				if (!(io && this.body_animation && "date" == shc_type)) {
					if ("date" != shc_type || this.selection.type) {
						const shc_cls = el_type.getAttribute("shc-cls");
						if (shc_cls) this.getClass(shc_cls, 0);
						else "SHCalendar-hover-" + shc_type;
						this.toggleClass(io, el_type, shc_cls);
					}
					if ("date" == shc_type) {
						this.toggleClass(
							io,
							el_type.parentNode.parentNode,
							"SHCalendar-hover-week"
						);
						this._showTooltip(el_type.getAttribute("shc-date"));
					}
					if (/^time-hour/.test(shc_type))
						this.toggleClass(io, this.els.timeHour, "SHCalendar-hover-time");
					if (/^time-min/.test(shc_type))
						this.toggleClass(io, this.els.timeMinute, "SHCalendar-hover-time");
					if (this.last_hover_date)
						this.removeClass(
							this.getElementDate(this.last_hover_date),
							"SHCalendar-hover-date"
						);
					this.last_hover_date = false;
				}
			}
		}
		if (!io) this._showTooltip();
	}

	wheelCHTime(event: any) {
		//https://rbyers.github.io/scroll-latency.html
		// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
		// b()
		var wheelStep: any;
		const el_type = this.getAttributeType(event);
		if (el_type) {
			const shc_btn = el_type.getAttribute("shc-btn");
			const shc_type = el_type.getAttribute("shc-type");
			wheelStep = event.wheelDelta ? event.wheelDelta / 120 : -event.detail / 3;
			wheelStep = 0 > wheelStep ? -1 : wheelStep > 0 ? 1 : 0;
			if (this.args.reverseWheel) wheelStep = -wheelStep;
			if (/^(time-(hour|min))/.test(shc_type)) {
				switch (shc_type) {
					case "time-hour":
						this.setHours(this.date.getHours() + wheelStep);
						break;
					case "time-min":
						this.setMinutes(
							this.date.getMinutes() + this.args.minuteStep * wheelStep
						);
						break;
				}
				this.stopEvent(event);
			} else {
				if (/Y/i.test(shc_btn)) wheelStep *= 2;
				this.stepDate(-wheelStep);
				this.stopEvent(event);
			}
		}
	}

	keypress(event: any) {
		var target,
			shc_btn,
			key_code,
			char_code,
			r,
			date: SHDate,
			date_int: number | false = false,
			yearInput: any,
			selection: any,
			d,
			m;
		if (!this.menu_animation) {
			target = event.target;
			shc_btn = target.getAttribute("shc-btn");
			key_code = event.keyCode;
			char_code = event.charCode || key_code;
			r = this.#control_key[key_code];
			if ("year" == shc_btn && 13 == key_code) {
				const date = this.date;
				date.setDate(1);
				date.setFullYear(this._getInputYear());
				this.moveTo(date, true);
				this.showMenu(false);
				return this.stopEvent(event);
			}
			if (this.menu_visible) {
				if (27 == key_code) {
					this.showMenu(false);
					return this.stopEvent(event);
				}
			} else {
				if (!event.ctrlKey) r = null;
				if (null != r || !event.ctrlKey) r = this.#ne[key_code];
				if (36 == key_code) r = 0;
				if (null != r) {
					this.stepDate(r);
					return this.stopEvent(event);
				}
				char_code = String.fromCharCode(char_code).toLowerCase();
				yearInput = this.els.yearInput;
				selection = this.selection;
				if (" " == char_code) {
					this.showMenu(true);
					this.focusingFocus();
					yearInput.focus();
					yearInput.select();
					return this.stopEvent(event);
				}
				if (char_code >= "0" && "9" >= char_code) {
					this.showMenu(true);
					this.focusingFocus();
					yearInput.value = char_code;
					yearInput.focus();
					return this.stopEvent(event);
				}
				d = event.shiftKey ? -1 : this.date.getMonth();
				for (m = 0; ++m < 12; ) {
					const mfn = this.getLanguage("mfn", (d + m) % 12)
						.toString()
						.toLowerCase();
					if (mfn.indexOf(char_code) == 0) {
						const date = this.date;
						date.setDate(1);
						date.setMonth((d + m) % 12);
						this.moveTo(date, true);
						return this.stopEvent(event);
					}
				}
				if (key_code >= 37 && 40 >= key_code) {
					date_int = this.last_hover_date;
					if (!(date_int || selection.isEmpty())) {
						date_int =
							39 > key_code
								? selection.getFirstDate()
								: selection.getLastDate();
						if (
							date_int < this.first_date_visible ||
							date_int > this.last_date_visible
						)
							date_int = false;
					}
					if (date_int) {
						date = SHCalendar.intToDate(date_int);
						for (d = 1e2; d > 0; d--) {
							switch (key_code) {
								case 37:
									date.setDate(date.getDate() - 1);
									break;
								case 38:
									date.setDate(date.getDate() - 7);
									break;
								case 39:
									date.setDate(date.getDate() + 1);
									break;
								case 40:
									date.setDate(date.getDate() + 7);
							}
							if (!this.isDisabled(date)) break;
						}
						date_int = SHCalendar.dateToInt(date);
						if (
							date_int < this.first_date_visible ||
							date_int > this.last_date_visible
						)
							this.moveTo(date);
					} else
						date_int =
							39 > key_code ? this.last_date_visible : this.first_date_visible;
					this.removeClass(
						this.getElementDate(date_int),
						this.addClass(
							this.getElementDate(date_int),
							"SHCalendar-hover-date"
						)
					);
					this.last_hover_date = date_int;
					return this.stopEvent(event);
				}
				if (13 == key_code && this.last_hover_date) {
					selection.type == SHCalendar.SEL_MULTIPLE &&
					(event.shiftKey || event.ctrlKey)
						? (event.shiftKey &&
								this.sel_range_start &&
								(selection.clear(true),
								selection.selectRange(
									this.sel_range_start,
									this.last_hover_date
								)),
						  event.ctrlKey &&
								selection.set(
									(this.sel_range_start = this.last_hover_date),
									true
								))
						: selection.reset((this.sel_range_start = this.last_hover_date));
					return this.stopEvent(event);
				}
				27 != key_code || this.args.cont || this.hide();
			}
		}
	}

	redraw() {
		this.refresh();
		const {
			topCont: els_topCont,
			menu: els_menu,
			bottomBar: els_bottomBar,
			dayNames: els_dayNames
		} = this.els;
		els_dayNames.innerHTML = this.Weeks();
		els_menu.innerHTML = this.Menu();
		if (els_bottomBar) els_bottomBar.innerHTML = this.BottomBar();
		const tis = this;
		this.setNode(els_topCont, (el: any) => {
			const cls = tis.#top_class[el.className];
			if (cls) tis.els[cls] = el;
			if (el.className == "SHCalendar-menu-year") {
				tis.addEvent(el, this.events_focusing);
				tis.els.yearInput = el;
			} else if (SHCalendar.IS_IE) el.setAttribute("unselectable", "on");
		});
		this.setTime(this.time, true);
	}

	focusingFocus() {
		const { yearInput: els_yearInput, focusLink: els_focusLink } = this.els;
		try {
			if (this.menu_visible) els_yearInput.focus();
			else els_focusLink.focus();
		} catch (err) {}
		this.onFocus();
	}

	onFocus() {
		//c
		const { main: els_main } = this.els;
		if (this.bluring_time_out) clearTimeout(this.bluring_time_out);
		this.focused = true;
		this.addClass(els_main, "SHCalendar-focused");
		this.callHooks("onFocus");
	}

	focusingBlur() {
		const { yearInput: els_yearInput, focusLink: els_focusLink } = this.els;
		els_focusLink.blur();
		els_yearInput.blur();
		this.onBlur();
	}

	onBlur() {
		//h
		this.focused = false;
		const { main: els_main } = this.els;
		this.removeClass(els_main, "SHCalendar-focused");
		if (this.menu_visible) this.showMenu(false);
		if (!this.args.cont) this.hide();
		this.callHooks("onBlur");
	}

	onBluringTimeout() {
		//u
		this.bluring_time_out = setTimeout(() => {
			this.onBlur();
		}, 50);
	}

	callHooks(evname: string, ...args: any[]) {
		const evn = this.handlers[evname];
		for (const key in evn) {
			if (evn.hasOwnProperty(key)) {
				evn[key].apply(this, args);
			}
		}
	}

	setHours(H24: number) {
		const { timeAM: els_timeAM, timeHour: els_timeHour } = this.els;
		if (H24 < 0) H24 += 24;
		H24 %= 24;
		this.setTime(H24 * 1e2 + (this.time % 1e2));
		this.date.setHours(H24);
		if (this.args.showTime == 12) {
			els_timeAM.innerHTML = Word.getMeridienFullName(H24);
			H24 = H24 % 12 || 12;
		}
		els_timeHour.innerHTML = H24.toString().padStart(2, "0");
	}

	setMinutes(minute: number) {
		const { minuteStep: args_minuteStep } = this.args,
			{ timeMinute: els_timeMinute } = this.els;
		if (minute < 0) minute += 60;
		minute %= 60;
		minute = Math.trunc(minute / args_minuteStep) * args_minuteStep;
		this.setTime(this.date.getHours() * 1e2 + minute);
		this.date.setMinutes(minute);
		els_timeMinute.innerHTML = minute.toString().padStart(2, "0");
	}

	setTime(time: number, nohooks: boolean = false) {
		const {
			input_field: args_input_field,
			showTime: args_showTime,
			dateFormat: args_dateFormat
		} = this.args;
		if (args_showTime) {
			this.time = time;
			if (!nohooks) {
				this.callHooks("onTimeChange", time);
				if (args_input_field) {
					args_input_field[
						args_input_field.tagName.toLowerCase() === "input"
							? "value"
							: "innerHTML"
					] = this.selection.print(args_dateFormat);
				}
			}
		}
	}

	stepTime(shc_type: string) {
		const { minuteStep: args_minuteStep } = this.args;
		const date = this.date;
		switch (shc_type) {
			case "time-hour+":
				this.setHours(date.getHours() + 1);
				break;
			case "time-hour-":
				this.setHours(date.getHours() - 1);
				break;
			case "time-min+":
				this.setMinutes(date.getMinutes() + args_minuteStep);
				break;
			case "time-min-":
				this.setMinutes(date.getMinutes() - args_minuteStep);
				break;
			default:
				return;
		}
	}

	static intToDate(
		date: SHDate | number | string,
		hours: number = 12,
		minute: number = 0
	): SHDate {
		if (date instanceof SHDate) return date;
		date = typeof date == "number" ? date : +date;
		const year: number = Math.trunc(date / 1e4);
		date %= 1e4;
		const month: number = Math.trunc(date / 1e2);
		date %= 1e2; //day
		return new SHDate(year, month - 1, date, hours, minute);
	}

	static dateToInt(date: SHDate | number | string): number {
		//L()
		if (date instanceof SHDate)
			return (
				date.getFullYear() * 1e4 + (date.getMonth() + 1) * 1e2 + date.getDate()
			);
		return typeof date == "string" ? +date : date;
	}

	_getInputYear() {
		var year = +this.els.yearInput.value;
		if (typeof year !== "number") {
			year = this.date.getFullYear();
		}
		return year;
	}

	getAttributeType(event: any) {
		let target = event.target;
		while (target && target.getAttribute && !target.getAttribute("shc-type")) {
			target = target.parentNode;
		}
		if (target.getAttribute) return target;
		return event.target;
	}

	getElementDate(shc_date: string | number | boolean): HTMLElement | false {
		let ـel: HTMLElement | false = false;
		if (shc_date) {
			this.setNode(this.els.body, (el: HTMLElement) => {
				if (el.getAttribute("shc-date") == shc_date) {
					ـel = el;
				}
			});
		}
		return ـel;
	}

	Animation(args: any, interval_id?: any, step: number = 0) {
		args = this.dataIntegration(args, {
			fps: 50, //frames per second (rate)
			len: 15, // all step
			onUpdate: Function(),
			onStop: Function()
		});
		if (SHCalendar.IS_IE) args.len = Math.round(args.len / 2);
		const args_len = args.len;
		const args_fps = args.fps;
		const result = {
			map: (
				math_animation: number,
				offset_height: number,
				offset: number,
				visible: number
			) => {
				if (visible) return offset + math_animation * (offset_height - offset);
				return offset_height + math_animation * (offset - offset_height);
			},
			update: () => {
				args.onUpdate(step / args_len, result.map);
				if (step === args_len) result.stop();
				step++;
			},
			start: () => {
				if (interval_id) result.stop();
				step = 0;
				interval_id = setInterval(result.update, 1e3 / args_fps);
			},
			stop: () => {
				if (interval_id) {
					clearInterval(interval_id);
					interval_id = null;
				}
				args.onStop(step / args_len, result.map);
			},
			args: args
		};
		result.start();
		return result;
	}

	setOpacity(el: any, value?: any) {
		// set opacity
		if (value === "") {
			el.style.opacity = "";
			el.style.filter = "";
		} else if (value != null) {
			if (SHCalendar.IS_IE) {
				el.style.filter = `alpha(opacity=${1e2 * value})`;
			} else {
				el.style.opacity = value;
			}
		} else if (SHCalendar.IS_IE && el.style.opacity) {
			const opacityMatch = el.style.opacity.match(/([0-9.]+)/);
			if (opacityMatch) {
				value = parseFloat(opacityMatch[1]) / 1e2;
			}
		}
		return value;
	}

	moveTo(date: SHDate, animation?: boolean | number) {
		//date , animation
		var stop_move: any,
			min: any = false,
			max: any = false,
			func_animation: any,
			body_offset_height_width: any,
			el_clone_node: any,
			el_clone_node_style: any;
		//   v,
		let date_comparison = this.dateComparison(date, this.date, true);
		const {
			min: args_min,
			max: args_max,
			animation: args_animation,
			opacity: args_opacity
		} = this.args;
		const {
			navPrevMonth: els_navPrevMonth,
			navNextMonth: els_navNextMonth,
			navPrevYear: els_navPrevYear,
			navNextYear: els_navNextYear,
			body: els_body
		} = this.els;
		if (args_min) min = this.dateComparison(date, args_min);
		if (args_max) max = this.dateComparison(date, args_max);
		if (!args_animation) animation = false;
		this.toggleClass(
			false != min && min <= 1,
			[els_navPrevMonth, els_navPrevYear],
			"SHCalendar-navDisabled"
		);
		this.toggleClass(
			false != max && max >= -1,
			[els_navNextMonth, els_navNextYear],
			"SHCalendar-navDisabled"
		);
		if (min < -1) {
			date = args_min;
			stop_move = 1;
			date_comparison = 0;
		}
		if (max > 1) {
			date = args_max;
			stop_move = 2;
			date_comparison = 0;
		}
		this.date = date;
		this.refresh(!!animation);
		this.callHooks("onChange", date, animation);
		if (!(!animation || (0 == date_comparison && 2 == animation))) {
			if (this.body_animation) this.body_animation.stop();
			const {
				firstChild: body_first_child,
				offsetHeight: body_offset_height,
				offsetWidth: body_offset_width
			} = els_body;
			const el = this.createElement(
				"div",
				"SHCalendar-animBody-" + this.#control_button[date_comparison],
				els_body
			);
			this.setOpacity(body_first_child, 0.7);
			if (stop_move) func_animation = this.#func_animation.brakes;
			else if (0 == date_comparison)
				func_animation = this.#func_animation.shake;
			else func_animation = this.#func_animation.accel_ab2;
			const is_date_comparison_bigger_four =
				date_comparison * date_comparison > 4;
			const body_first_child_offset_top_left = is_date_comparison_bigger_four
				? body_first_child.offsetTop
				: body_first_child.offsetLeft;
			const el_style = el.style;
			var body_offset_height_width = is_date_comparison_bigger_four
				? body_offset_height
				: body_offset_width;
			if (date_comparison < 0)
				body_offset_height_width += body_first_child_offset_top_left;
			else if (date_comparison > 0)
				body_offset_height_width =
					body_first_child_offset_top_left - body_offset_height_width;
			else {
				body_offset_height_width = Math.round(body_offset_height_width / 7);
				if (2 == stop_move)
					body_offset_height_width = -body_offset_height_width;
			}
			if (!(stop_move || 0 == date_comparison)) {
				el_clone_node = el.cloneNode(true);
				el_clone_node_style = el_clone_node.style;
				//v = 2 * body_offset_height_width;
				el_clone_node.appendChild(body_first_child.cloneNode(true));
				el_clone_node_style[
					is_date_comparison_bigger_four ? "marginTop" : "marginLeft"
				] = body_offset_height_width + "px";
				els_body.appendChild(el_clone_node);
			}
			body_first_child.style.visibility = "hidden";
			el.innerHTML = this.Day(date);
			const tis = this;
			this.body_animation = this.Animation({
				onUpdate: function (pos: number, func_map: Function) {
					var n: any;
					const math_anime = func_animation(pos);
					if (el_clone_node)
						n =
							func_map(
								math_anime,
								body_offset_height_width,
								2 * body_offset_height_width
							) + "px";
					if (stop_move)
						el_style[
							is_date_comparison_bigger_four ? "marginTop" : "marginLeft"
						] = func_map(math_anime, body_offset_height_width, 0) + "px";
					else {
						if (is_date_comparison_bigger_four || 0 == date_comparison) {
							el_style.marginTop =
								func_map(
									0 == date_comparison ? func_animation(pos * pos) : math_anime,
									0,
									body_offset_height_width
								) + "px";
							if (0 != date_comparison) el_clone_node_style.marginTop = n;
						}
						if (!(is_date_comparison_bigger_four && 0 != date_comparison)) {
							el_style.marginLeft =
								func_map(math_anime, 0, body_offset_height_width) + "px";
							if (0 != date_comparison) el_clone_node_style.marginLeft = n;
						}
					}
					if (args_opacity > 2 && el_clone_node) {
						tis.setOpacity(el_clone_node, 1 - math_anime);
						tis.setOpacity(el, math_anime);
					}
				},
				onStop: function () {
					els_body.innerHTML = tis.Day(tis.date);
					tis.body_animation = null;
				}
			});
		}
		this.last_hover_date = false;
		return min >= -1 && max <= 1;
	}

	isDisabled(date: SHDate) {
		const { min, max, disabled } = this.args;
		if (min && this.dateComparison(date, min) < 0) {
			return true;
		} else if (max && this.dateComparison(date, max) > 0) {
			return true;
		} else if (disabled) {
			return this.args.disabled(date);
		}
		return false;
	}

	toggleMenu() {
		this.showMenu(!this.menu_visible);
	}

	refresh(noBody = false) {
		const { body, title, yearInput } = this.els;
		if (!noBody) body.innerHTML = this.Day(this.date);
		title.innerHTML = this.Title();
		if (yearInput) yearInput.value = this.date.getFullYear();
	}

	showMenu(visible: boolean) {
		const { menu, title, main, topBar } = this.els;
		this.menu_visible = visible;
		this.toggleClass(visible, title, "SHCalendar-pressed-title");
		if (menu) {
			if (SHCalendar.IS_IE6) menu.style.height = main.offsetHeight + "px";
			if (this.args.animation) {
				if (this.menu_animation) this.menu_animation.stop();
				const offset_height = main.offsetHeight;
				if (SHCalendar.IS_IE6) menu.style.width = topBar.offsetWidth + "px";
				if (visible) {
					menu.firstChild.style.marginTop = -offset_height + "px";
					if (this.args.opacity > 0) this.setOpacity(menu, 0);
					this.styleDisplay(menu, true);
				}
				const tis = this;
				this.menu_animation = this.Animation({
					onUpdate: (pos: number, func_map: Function) => {
						menu.firstChild.style.marginTop =
							func_map(
								tis.#func_animation.accel_b(pos),
								-offset_height,
								0,
								!visible
							) + "px";
						if (tis.args.opacity > 0)
							tis.setOpacity(
								menu,
								func_map(tis.#func_animation.accel_b(pos), 0, 0.85, !visible)
							);
					},
					onStop: () => {
						if (tis.args.opacity > 0) tis.setOpacity(menu, 0.85);
						menu.firstChild.style.marginTop = "";
						tis.menu_animation = null;
						if (!visible) {
							tis.styleDisplay(menu, false);
							if (tis.focused) tis.focusingFocus();
						}
					}
				});
			} else {
				this.styleDisplay(menu, visible);
				if (this.focused) this.focusingFocus();
			}
		}
	}

	styleDisplay(el: HTMLElement, is_display: boolean): boolean {
		if (is_display != undefined) {
			el.style.display = is_display ? "" : "none";
		}
		return el.style.display !== "none";
	}

	removeClass(el: HTMLElement | false, old_class: any, new_class: any = 0) {
		if (el) {
			el.classList.remove(old_class);
			if (new_class) {
				this.addClass(el, new_class);
			}
		}
		return new_class;
	}

	addClass(el: HTMLElement | false, new_class: string) {
		if (el) {
			el.classList.add(new_class);
		}
	}

	getClass(string: string, index: number) {
		const class_list = string.split(",");
		if (!(index < 0 || index >= class_list.length)) {
			return "SHCalendar-" + class_list[index].trim();
		}
		return "";
	}

	toggleClass(
		is_change: boolean,
		el: HTMLElement | HTMLElement[],
		style_class: string
	) {
		if (el instanceof Array) {
			for (let i = el.length - 1; i >= 0; i--) {
				this.toggleClass(is_change, el[i], style_class);
			}
		} else {
			if (is_change) {
				el.classList.add(style_class);
			} else {
				el.classList.remove(style_class);
			}
		}
		return is_change;
	}

	dateComparison(
		first_date: SHDate,
		second_date: SHDate,
		is_day: boolean = false
	) {
		const yearComparison = second_date.getFullYear() - first_date.getFullYear();
		if (yearComparison !== 0) {
			return yearComparison > 0 ? -3 : 3;
		}
		const monthComparison = second_date.getMonth() - first_date.getMonth();
		if (monthComparison !== 0) {
			return monthComparison > 0 ? -2 : 2;
		}
		if (is_day) {
			const dayComparison = second_date.getDate() - first_date.getDate();
			if (dayComparison !== 0) {
				return dayComparison > 0 ? -1 : 1;
			}
		}
		return 0;
	}

	stepDate(shc_btn: any, anim: any = false) {
		const date = this.date.clone(),
			year = date.getFullYear(),
			month = date.getMonth();
		switch (shc_btn) {
			case "+Y":
			case 2:
				date.setFullYear(year + 1, month, 1);
				break;
			case "-Y":
			case -2:
				date.setFullYear(year - 1, month, 1);
				break;
			case "+M":
			case 1:
				date.setFullYear(year, month + 1, 1);
				break;
			case "-M":
			case -1:
				date.setFullYear(year, month - 1, 1);
				break;
			default:
				return;
		}
		if (this.body_animation) this.body_animation.stop();
		return this.moveTo(date, !anim);
	}

	hide() {
		this.callHooks("onClose", this);
		const { topCont: els_top_cont } = this.els,
			{ firstChild: body_first_child } = this.els.body;
		if (this.args.animation) {
			if (this.show_animation) this.show_animation.stop();
			const tis = this;
			this.show_animation = this.Animation({
				onUpdate: (pos: number, func_map: Function) => {
					if (tis.args.opacity > 1) tis.setOpacity(els_top_cont, 1 - pos);
					body_first_child.style.marginTop =
						-func_map(
							tis.#func_animation.accel_b(pos),
							0,
							body_first_child.offsetHeight
						) + "px";
					els_top_cont.style.top =
						func_map(
							tis.#func_animation.accel_ab(pos),
							tis.getElementOffset(els_top_cont).y,
							tis.getElementOffset(els_top_cont).y - 10
						) + "px";
				},
				onStop: () => {
					els_top_cont.style.display = "none";
					body_first_child.style.marginTop = "";
					if (tis.args.opacity > 1) tis.setOpacity(els_top_cont, "");
					tis.show_animation = null;
				}
			});
		} else {
			els_top_cont.style.display = "none";
		}
		this.input_field = null;
	}

	_showTooltip(full_date?: number) {
		var template: string = "";
		if (full_date) {
			const date: SHDate = SHCalendar.intToDate(full_date);
			if (this.args.dateInfo) {
				const dateInfo = this.args.dateInfo(date);
				if (dateInfo && dateInfo.tooltip) {
					template =
						"<div class='SHCalendar-tooltipCont'>" +
						this.format(dateInfo.tooltip, date) +
						"</div>";
				}
			}
		}
		if (this.els.tooltip) {
			this.els.tooltip.innerHTML = template;
		}
	}

	isRTL(lang: string = this.lang) {
		if (Word.isRTL(lang)) return true;
		return false;
	}

	getLanguage(
		name: string,
		data: number | false = false,
		lang: string = this.lang
	): string | number[] {
		switch (name) {
			case "goToday":
				return Word.getGoToday(lang);
			case "today":
				return Word.getToday(lang);
			case "wk":
				return Word.getWeekName(lang);
			case "weekend":
				const weekend = Word.getWeekend(lang);
				return weekend instanceof Array ? weekend : [weekend];
			case "mfn":
				return Word.getMonthFullName(data as number, lang);
			case "msn":
				return Word.getMonthShortName(data as number, lang);
			case "dfn":
				return Word.getDayFullName(data as number, lang);
			case "dsn":
				return Word.getDayShortName(data as number, lang);
			default:
				return "";
		}
	}

	setLanguage(lang: string) {
		this.lang = lang;
		this.redraw();
	}

	setFristDayOfWeek(fdow: number) {
		this.fdow = fdow;
		this.redraw();
	}

	format(str: string, date: SHDate = this.date, lang: string = this.lang): any {
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();
		const doy = date.getDayOfYear();
		const [iso_year, iso_week] = date.getWeekOfYear();
		const dow = date.getDay();
		const h24 = date.getHours();
		const h12 = h24 % 12 || 12;
		const minutes = date.getMinutes();
		const second = date.getSeconds();
		const data = new Map();
		data.set("%A", Word.getDayFullName(dow, lang));
		data.set("%a", Word.getDayShortName(dow, lang));
		data.set("%B", Word.getMonthFullName(month, lang));
		data.set("%b", Word.getMonthShortName(month, lang));
		data.set("%d", `${day}`.padStart(2, "0"));
		data.set("%e", `${day}`);
		data.set("%j", `${doy}`.padStart(3, "0"));
		data.set("%m", `${month + 1}`.padStart(2, "0"));
		data.set("%o", `${month + 1}`);
		data.set("%U", `${iso_week}`.padStart(2, "0"));
		data.set("%W", `${iso_year}`.padStart(4, "0"));
		data.set("%u", `${dow + 1}`);
		data.set("%w", `${dow}`);
		data.set("%y", `${year % 1e2}`);
		data.set("%Y", `${year}`);
		data.set("%C", `${Math.trunc(year / 1e2) + 1}`);
		data.set("%H", `${h24}`.padStart(2, "0"));
		data.set("%k", `${h24}`);
		data.set("%I", `${h12}`.padStart(2, "0"));
		data.set("%l", `${h12}`);
		data.set("%M", `${minutes}`.padStart(2, "0"));
		data.set("%S", `${second}`.padStart(2, "0"));
		data.set("%p", Word.getMeridienFullName(h24, lang));
		data.set("%P", Word.getMeridienShortName(h24, lang));
		data.set("%s", `${Math.trunc(date.getTime() / 1e3)}`);
		data.set(
			"%r",
			`${data.get("%I")}:${data.get("%M")}:${data.get("%S")} ${data.get("%p")}`
		);
		data.set("%R", `${data.get("%H")}:${data.get("%M")}`);
		data.set("%T", `${data.get("%H")}:${data.get("%M")}:${data.get("%S")}`);
		data.set("%D", `${data.get("%Y")}/${data.get("%m")}/${data.get("%d")}`);
		data.set("%F", `${data.get("%Y")}-${data.get("%m")}-${data.get("%d")}`);
		data.set("%t", `\t`);
		data.set("%n", `\n`);
		data.set("%%", "%");
		return str.replace(/%./g, (item) => {
			return data.has(item) ? data.get(item) : item;
		});
	}

	static parseDate(str: string, n: any, date_now?: SHDate) {
		//str, n, date_now?
		var year: any,
			month: any,
			day: any,
			hours: number = 0,
			minute: number = 0,
			second: number = 0,
			time: any,
			u: any,
			d: any,
			f: any,
			y: any;
		if (!/\S/.test(str)) return "";
		str = str.replace(/^\s+/, "").replace(/\s+$/, "");
		if (!date_now) date_now = new SHDate();
		time = str.match(/([0-9]{1,2}):([0-9]{1,2})(:[0-9]{1,2})?\s*(am|pm)?/i);
		if (time) {
			hours = +time[1];
			minute = +time[2];
			second = time[3] ? +time[3].substring(1) : 0;
			str =
				str.substring(0, time.index) +
				str.substring(time.index + time[0].length);
			if (time[4]) {
				time[4].toLowerCase() == "pm" && 12 > hours
					? (hours += 12)
					: time[4].toLowerCase() != "am" || 12 > hours || (hours -= 12);
			}
		}
		u = (() => {
			const charAt = () => {
				return str.charAt(l);
			};
			const charAtNext = () => {
				return str.charAt(l++);
			};
			const s = (t: any) => {
				for (; charAt() && is_unicode_letter(charAt()); ) t += charAtNext();
				return t;
			};
			const i = () => {
				for (var t = ""; charAt() && /[0-9]/.test(charAt()); )
					t += charAtNext();
				return is_unicode_letter(charAt()) ? s(t) : +t;
			};
			const push = (t: any) => {
				c.push(t);
			};
			var o: any,
				l: any,
				c: any = [],
				is_unicode_letter = (arg: any) => SHCalendar.isUnicodeLetter(arg);
			for (l = 0; l < str.length; ) {
				o = charAt();
				is_unicode_letter(o)
					? push(s(""))
					: /[0-9]/.test(o)
					  ? push(i())
					  : charAtNext();
			}
			return c;
		})();

		d = [];
		for (f = 0; f < u.length; ++f) {
			y = u[f];
			/^[0-9]{4}$/.test(y)
				? ((year = +y), null == month && null == day && null == n && (n = true))
				: /^[0-9]{1,2}$/.test(y)
				  ? ((y = +y),
				    60 > y
							? 0 > y || y > 12
								? 1 > y || y > 31 || (day = y)
								: d.push(y)
							: (year = y))
				  : null == month && (month = this.kcmonth(y));
		}

		d.length < 2
			? d.length == 1 &&
			  (null == day ? (day = d.shift()) : null == month && (month = d.shift()))
			: n
			  ? (null == month && (month = d.shift()),
			    null == day && (day = d.shift()))
			  : (null == day && (day = d.shift()),
			    null == month && (month = d.shift()));
		if (null == year) year = d.length > 0 ? d.shift() : date_now.getFullYear();
		if (30 > year) year += 2e3;
		else if (99 > year) year += 1900;
		if (null == month) month = date_now.getMonth() + 1;
		if (null != year && null != month && null != day)
			return new SHDate(year, month - 1, day, hours, minute, second);
		return null;
	}

	kcmonth(t: string) {
		if (/\S/.test(t)) {
			t = t.toLowerCase();
			for (let i = 0; i < 12; i++) {
				if (this.getLanguage("msn", i).toString().toLowerCase().startsWith(t)) {
					return i + 1;
				}
				if (this.getLanguage("mfn", i).toString().toLowerCase().startsWith(t)) {
					return i + 1;
				}
			}
		}
		return 0;
	}

	static isUnicodeLetter(str: string) {
		return str.toLowerCase() !== str.toUpperCase();
	}

	template() {
		const calendarTopCont =
			"<table class='SHCalendar-topCont' align='center' cellspacing='0' cellpadding='0'><tr><td><div class='SHCalendar'>";
		const focusLink = SHCalendar.IS_IE
			? "<a class='SHCalendar-focusLink' href='#'></a>"
			: "<button class='SHCalendar-focusLink'></button>";
		const topBar =
			"<div class='SHCalendar-topBar'><div shc-type='nav' shc-btn='-Y' shc-cls='hover-navBtn,pressed-navBtn' class='SHCalendar-navBtn SHCalendar-prevYear'><div></div></div><div shc-type='nav' shc-btn='+Y' shc-cls='hover-navBtn,pressed-navBtn' class='SHCalendar-navBtn SHCalendar-nextYear'><div></div></div><div shc-type='nav' shc-btn='-M' shc-cls='hover-navBtn,pressed-navBtn' class='SHCalendar-navBtn SHCalendar-prevMonth'><div></div></div><div shc-type='nav' shc-btn='+M' shc-cls='hover-navBtn,pressed-navBtn' class='SHCalendar-navBtn SHCalendar-nextMonth'><div></div></div><table class='SHCalendar-titleCont' align='center' cellspacing='0' cellpadding='0'><tr><td><div shc-type='title' shc-btn='menu' shc-cls='hover-title,pressed-title' class='SHCalendar-title'>" +
			this.Title() +
			"</div></td></tr></table><div class='SHCalendar-dayNames'>" +
			this.Weeks() +
			"</div></div>";
		const body = "<div class='SHCalendar-body'></div>";
		const bottomBar =
			this.args.bottomBar || this.args.showTime
				? "<div class='SHCalendar-bottomBar'>" + this.BottomBar() + "</div>"
				: "";
		const menu =
			"<div class='SHCalendar-menu' style='display: none'>" +
			this.Menu() +
			"</div>";
		const tooltip = "<div class='SHCalendar-tooltip'></div>";
		const calendar = "</div></td></tr></table>";

		return (
			calendarTopCont +
			focusLink +
			topBar +
			body +
			bottomBar +
			menu +
			tooltip +
			calendar
		);
	}

	Title() {
		//Title
		return (
			"<div unselectable='on'>" +
			this.format(this.args.titleFormat, this.date) +
			"</div>"
		);
	}

	Menu() {
		const year = this.date.getFullYear();
		const yearInput =
			"<input shc-btn='year' class='SHCalendar-menu-year' size='6' value='" +
			year +
			"' />";
		const todayButton =
			"<div shc-type='menubtn' shc-cls='hover-navBtn,pressed-navBtn' shc-btn='today'>" +
			this.getLanguage("goToday") +
			"</div>";
		var month = 0;
		const monthTable =
			"<table class='SHCalendar-menu-mtable' align='center' cellspacing='0' cellpadding='0'>" +
			Array.from({ length: 4 }, (_, i) => {
				const monthButtons = Array.from({ length: 3 }, (_, j) => {
					return `<td><div shc-type='menubtn' shc-cls='hover-navBtn,pressed-navBtn' shc-btn='m${month}' class='SHCalendar-menu-month'>${this.getLanguage(
						"msn",
						month++
					)}</div></td>`;
				}).join("");
				return `<tr>${monthButtons}</tr>`;
			}).join("") +
			"</table>";

		return `<table height='102%' align='center' cellspacing='0' cellpadding='0'><tr><td><table style='margin-top: 1.5em' align='center' cellspacing='0' cellpadding='0'><tr><td colspan='3'>${yearInput}</td><td><div shc-type='menubtn' shc-cls='hover-navBtn,pressed-navBtn' shc-btn='today'>${year}</div></td></tr><tr><td>${todayButton}</td></tr></table><p class='SHCalendar-menu-sep'>&nbsp;</p>${monthTable}</td></tr></table>`;
	}

	Weeks() {
		const weekNumber = this.args.weekNumbers
			? "<td><div class='SHCalendar-weekNumber'>" +
			  this.getLanguage("wk") +
			  "</div></td>"
			: "";
		const daysOfWeek = Array.from({ length: 7 }, (_, col) => {
			const day = (col + this.fdow) % 7;
			return `<td><div${
				this.isWeekend(day) ? " class='SHCalendar-weekend'" : ""
			}>${this.getLanguage("dsn", day)}</div></td>`;
		}).join("");

		return `<table align='center' cellspacing='0' cellpadding='0'><tr>${weekNumber}${daysOfWeek}</tr></table>`;
	}

	isWeekend(day: number): boolean {
		return (this.getLanguage("weekend") as number[]).includes(day);
	}

	Day(date_now: SHDate, fdow: number = this.fdow) {
		const today = new SHDate();
		const year_today = today.getFullYear();
		const month_today = today.getMonth();
		const day_today = today.getDate();
		const fulldate_today =
			1e4 * year_today + 1e2 * (month_today + 1) + day_today;
		const date = date_now.clone();
		const month_view = date.getMonth();
		const is_wk = this.args.weekNumbers;
		let template: string[] = [];

		date.setHours(12, 0);
		date.setMonth(date.getMonth(), 1);
		const [iy, iw] = date.getWeekOfYear(); //  frist date of the month
		date.setWeek(iy, iw); // first date of week

		template.push(
			"<table class='SHCalendar-bodyTable' align='center' cellspacing='0' cellpadding='0'>"
		);

		for (let horizontal = 0; horizontal < 6; horizontal++) {
			template.push("<tr class='SHCalendar-week");
			if (horizontal === 0) template.push(" SHCalendar-first-row");
			if (horizontal === 5) template.push(" SHCalendar-last-row");
			template.push("'>");

			if (is_wk) {
				template.push(
					`<td class='SHCalendar-first-col'><div class='SHCalendar-weekNumber'>${
						date.getWeekOfYear()[1]
					}</div></td>`
				);
			}
			for (let vertical = 0; vertical < 7; vertical++) {
				const day = date.getDate();
				const month = date.getMonth();
				const year = date.getFullYear();
				const fulldate = 1e4 * year + 1e2 * (month + 1) + day;

				template.push("<td class='");

				if (vertical === 0 && !is_wk) {
					template.push(" SHCalendar-first-col");
					if (horizontal === 0) {
						this.first_date_visible = fulldate;
					}
				}
				if (vertical === 6) {
					template.push(" SHCalendar-last-col");
					if (horizontal === 5) this.last_date_visible = fulldate;
				}

				const is_selected = this.selection.isSelected(fulldate);
				if (is_selected) template.push(" SHCalendar-td-selected");

				template.push(
					`'><div shc-type='date' unselectable='on' shc-date='${fulldate}'`
				);

				const is_disabled = this.isDisabled(date);
				if (is_disabled) template.push(" disabled='1' ");

				template.push("class='SHCalendar-day");

				if (this.isWeekend(date.getDay())) template.push(" SHCalendar-weekend");
				if (month !== month_view) template.push(" SHCalendar-day-othermonth");
				if (fulldate === fulldate_today) template.push(" SHCalendar-day-today");
				if (is_disabled) template.push(" SHCalendar-day-disabled");
				if (is_selected) template.push(" SHCalendar-day-selected");

				if (this.args.dateInfo) {
					const date_info = this.args.dateInfo(date);
					if (is_disabled && date_info.klass)
						template.push(" " + date_info.klass);
				}
				template.push("'>" + day + "</div></td>");
				date.setMonth(date.getMonth(), date.getDate() + 1);
			}
			template.push("</tr>");
		}
		template.push("</table>");
		return template.join("");
	}

	Time() {
		const template: string[] = [];

		template.push(
			"<table class='SHCalendar-time' align='center' cellspacing='0' cellpadding='0'>",
			"<tr>",
			"<td rowspan='2'><div shc-type='time-hour' shc-cls='hover-time,pressed-time' class='SHCalendar-time-hour'></div></td>",
			"<td shc-type='time-hour+' shc-cls='hover-time,pressed-time' class='SHCalendar-time-up'></td>",
			"<td rowspan='2' class='SHCalendar-time-sep'></td>",
			"<td rowspan='2'><div shc-type='time-min' shc-cls='hover-time,pressed-time' class='SHCalendar-time-minute'></div></td>",
			"<td shc-type='time-min+' shc-cls='hover-time,pressed-time' class='SHCalendar-time-up'></td>"
		);

		if (this.args.showTime == 12) {
			template.push(
				"<td rowspan='2' class='SHCalendar-time-sep'></td>",
				"<td rowspan='2'><div class='SHCalendar-time-am' shc-type='time-am' shc-cls='hover-time,pressed-time'></div></td>"
			);
		}

		template.push(
			"</tr>",
			"<tr>",
			"<td shc-type='time-hour-' shc-cls='hover-time,pressed-time' class='SHCalendar-time-down'></td>",
			"<td shc-type='time-min-' shc-cls='hover-time,pressed-time' class='SHCalendar-time-down'></td>",
			"</tr>",
			"</table>"
		);

		return template.join("");
	}

	BottomBar() {
		const template: string[] = [];

		template.push(
			"<table align='center' cellspacing='0' cellpadding='0' style='width:1e2%'><tr>"
		);

		if (this.args.showTime && this.args.timePos === "left") {
			template.push("<td>", this.Time(), "</td>");
		}

		if (this.args.bottomBar) {
			template.push(
				"<td>",
				"<table align='center' cellspacing='0' cellpadding='0'><tr>",
				"<td>",
				"<div shc-btn='today' shc-cls='hover-bottomBar-today,pressed-bottomBar-today' shc-type='bottomBar-today' class='SHCalendar-bottomBar-today'>",
				`${this.getLanguage("today")}`,
				"</div>",
				"</td>",
				"</tr></table>",
				"</td>"
			);
		}

		if (this.args.showTime && this.args.timePos === "right") {
			template.push("<td>", this.Time(), "</td>");
		}

		template.push("</tr></table>");

		return template.join("");
	}

	getVersion() {
		return SHCalendar.VERSION;
	}

	inputField() {
		this.refresh();
		const input_field = this.input_field;
		const sel = this.selection;
		if (input_field) {
			if (/input|textarea/i.test(input_field.tagName))
				input_field.value = sel.print(this.date_format);
			else input_field.innerHTML = sel.print(this.date_format);
		}
		this.callHooks("onSelect", sel);
	}

	popupForField(
		el_trigger: HTMLElement,
		el_field: HTMLElement | any,
		date_format: string
	) {
		var date: any, i: any, r: any;
		if (!(el_trigger instanceof HTMLElement))
			el_trigger = this.getElementById(el_trigger);
		if (!(el_field instanceof HTMLElement))
			el_field = this.getElementById(el_field);
		this.input_field = el_field;
		this.date_format = date_format;
		if (this.selection.type == SHCalendar.SEL_SINGLE) {
			date = /input|textarea/i.test(el_field.tagName)
				? el_field.value
				: el_field.innerText || el_field.textContent;
			if (date) {
				i = /(^|[^%])%[bBmo]/.exec(date_format);
				r = /(^|[^%])%[de]/.exec(date_format);
				if (i && r) {
					date = SHCalendar.parseDate(date, i.index < r.index);
				}
				if (date) {
					this.selection.set(date, false, true);
					if (this.args.showTime) {
						this.setHours(date.getHours()), this.setMinutes(date.getMinutes());
					}
					this.moveTo(date);
				}
			}
		}
		this.popup(el_trigger);
	}

	manageFields(trigger: string, field: string, date_format: string) {
		const el_field = this.getElementById(field);
		const el_trigger = this.getElementById(trigger);
		if (/^button$/i.test(el_trigger.tagName))
			el_trigger.setAttribute("type", "button");
		this.addEvent(el_trigger, "click", (event: any) => {
			this.popupForField(el_trigger, el_field, date_format);
			return this.stopEvent(event);
		});
	}

	popup(trigger: any, align?: any) {
		this.showAt(0, 0);
		const { topCont: els_top_cont } = this.els,
			{ style: els_top_cont_style } = els_top_cont;
		els_top_cont_style.visibility = "hidden";
		els_top_cont_style.display = "";
		document.body.appendChild(els_top_cont);
		const top_cont_offset: { x: any; y: any } = {
			x: els_top_cont.offsetWidth,
			y: els_top_cont.offsetHeight
		};
		const el_trigger: HTMLElement = this.getElementById(trigger),
			trigger_offset = this.getElementOffset(el_trigger);
		let offset: { x: any; y: any } = trigger_offset;
		if (!align) align = this.args.align;
		align = align.split(/\x2f/);
		offset = this.alignmentPopup(align[0], el_trigger, top_cont_offset, offset);
		let position_mouse = this.getMouseOffset();
		if (offset.y < position_mouse.y) {
			offset.y = trigger_offset.y;
			offset = this.alignmentPopup(
				align[1],
				el_trigger,
				top_cont_offset,
				offset
			);
		}
		if (offset.x + top_cont_offset.x > position_mouse.x + position_mouse.w) {
			offset.x = trigger_offset.x;
			offset = this.alignmentPopup(
				align[2],
				el_trigger,
				top_cont_offset,
				offset
			);
		}
		if (offset.y + top_cont_offset.y > position_mouse.y + position_mouse.h) {
			offset.y = trigger_offset.y;
			offset = this.alignmentPopup(
				align[3],
				el_trigger,
				top_cont_offset,
				offset
			);
		}
		if (offset.x < position_mouse.x) {
			offset.x = trigger_offset.x;
			offset = this.alignmentPopup(
				align[4],
				el_trigger,
				top_cont_offset,
				offset
			);
		}
		console.log(position_mouse, offset);
		this.showAt(offset.x, offset.y, true);
		els_top_cont_style.visibility = "";
		this.focusingFocus();
	}

	alignmentPopup = (
		align: any,
		el_trigger: HTMLElement,
		top_cont_offset: { x: any; y: any },
		offset: { x: any; y: any }
	) => {
		var pos: any = { x: offset.x, y: offset.y };
		if (align) {
			// vertical alignment
			if (/B/.test(align)) pos.y += el_trigger.offsetHeight;
			if (/b/.test(align)) pos.y += el_trigger.offsetHeight - top_cont_offset.y;
			if (/T/.test(align)) pos.y -= top_cont_offset.y;
			if (/m/i.test(align))
				pos.y += (el_trigger.offsetHeight - top_cont_offset.y) / 2;
			// horizontal alignment
			if (/l/.test(align)) pos.x -= top_cont_offset.x - el_trigger.offsetWidth;
			if (/L/.test(align)) pos.x -= top_cont_offset.x;
			if (/R/.test(align)) pos.x += el_trigger.offsetWidth;
			if (/c/i.test(align))
				pos.x += (el_trigger.offsetWidth - top_cont_offset.x) / 2;
		}
		return pos;
	};

	showAt(lpos: any, tpos: any, is_animation?: any) {
		if (this.show_animation) this.show_animation.stop();
		const { topCont: els_top_cont } = this.els,
			{ firstChild: body_first_child } = this.els.body,
			{ offsetHeight: body_first_child_offset_height } = body_first_child,
			els_top_cont_style = els_top_cont.style;
		els_top_cont_style.getOffset = "absolute";
		els_top_cont_style.left = lpos + "px";
		els_top_cont_style.top = tpos + "px";
		els_top_cont_style.zIndex = 1e4;
		els_top_cont_style.display = "";
		if (is_animation && this.args.animation) {
			body_first_child.style.marginTop = -body_first_child_offset_height + "px";
			if (this.args.opacity > 1) {
				this.setOpacity(els_top_cont, 0);
				const tis = this;
				this.show_animation = this.Animation({
					onUpdate: function (pos: any, func_map: Function) {
						body_first_child.style.marginTop =
							-func_map(
								tis.#func_animation.accel_b(pos),
								body_first_child_offset_height,
								0
							) + "px";
						if (tis.args.opacity > 1) tis.setOpacity(els_top_cont, pos);
					},
					onStop: function () {
						if (tis.args.opacity > 1) tis.setOpacity(els_top_cont, "");
						tis.show_animation = null;
					}
				});
			}
		}
	}

	getElementOffset(el: HTMLElement | any) {
		if (el.getBoundingClientRect) {
			const BCR = el.getBoundingClientRect();
			const { documentElement, body } = document;
			return {
				x: BCR.left - documentElement.clientLeft + body.scrollLeft,
				y: BCR.top - documentElement.clientTop + body.scrollTop
			};
		}
		let left = 0,
			top = 0;
		do {
			left += el.offsetLeft - el.scrollLeft;
			top += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		} while (el);
		return {
			x: left,
			y: top
		};
	}

	getOffset(even: any, pos: { x: number; y: number }) {
		let x: number, y: number;
		if (SHCalendar.IS_IE) {
			const { body } = document;
			x = even.clientX + body.scrollLeft;
			y = even.clientY + body.scrollTop;
		} else {
			x = even.pageX;
			y = even.pageY;
		}
		if (pos) {
			x -= pos.x;
			y -= pos.y;
		}
		return {
			x: x,
			y: y
		};
	}

	dragIt(event: any) {
		let { style } = this.els.topCont,
			pos = this.getOffset(event, this._mouseDiff);
		style.left = pos.x + "px";
		style.top = pos.y + "px";
	}

	getMouseOffset() {
		const { documentElement, body } = document;
		return {
			x: documentElement.scrollLeft || body.scrollLeft || window.scrollX,

			y: documentElement.scrollTop || body.scrollTop || window.scrollY,

			w: documentElement.clientWidth || window.innerWidth || body.clientWidth,
			h: documentElement.clientHeight || window.innerHeight || body.clientHeight
			//|| body.offsetHeight
		};
	}
}
