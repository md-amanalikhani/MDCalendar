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
import Selection, { SelectionType } from "./selection.js";
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

	#math_animation = {
		//ae
		elastic_b: function (t: number) {
			return 1 - Math.cos(5.5 * -t * Math.PI) / Math.pow(2, 7 * t);
		},
		magnetic: function (t: number) {
			return 1 - Math.cos(10.5 * t * t * t * Math.PI) / Math.exp(4 * t);
		},
		accel_b: function (t: number) {
			return (t = 1 - t), 1 - t * t * t * t;
		},
		accel_a: function (t: number) {
			return t * t * t;
		},
		accel_ab: function (t: number) {
			return (t = 1 - t), 1 - Math.sin((t * t * Math.PI) / 2);
		},
		accel_ab2: function (t: number) {
			return (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
		},
		brakes: function (t: number) {
			return (t = 1 - t), 1 - Math.sin(t * t * Math.PI);
		},
		shake: function (t: number) {
			return 0.5 > t
				? -Math.cos(11 * t * Math.PI) * t * t
				: ((t = 1 - t), Math.cos(11 * t * Math.PI) * t * t);
		}
	};

	static SEL_NONE: number = SelectionType.NONE;
	static SEL_SINGLE: number = SelectionType.SINGLE;
	static SEL_MULTIPLE: number = SelectionType.MULTIPLE;
	static SEL_WEEK: number = SelectionType.WEEK;

	static defaultArgs = {
		cont: null,
		bottomBar: true,
		titleFormat: "%b %Y",
		dateFormat: "%Y-%m-%d",
		// date:true,
		weekNumbers: false,
		time: true,
		fdow: Word.getFirstDayOfWeek(),
		min: false,
		max: false,
		showTime: false,
		timePos: "right",
		minuteStep: 5,
		checkRange: false,
		animation: !SHCalendar.IS_IE6,
		opacity: SHCalendar.IS_IE ? 1 : 3,
		selection: [],
		selectionType: SelectionType.MULTIPLE,
		inputField: false,
		lang: "en_US",
		trigger: false,
		align: "Bl/ / /T/r",
		multiCtrl: true,
		fixed: false,
		reverseWheel: false,
		noScroll: false,
		disabled: false,
		dateInfo: false,
		onChange: false,
		onSelect: false,
		onTimeChange: false,
		onFocus: false,
		onBlur: false,
		onClose: false
	};
	args: any;
	handlers: any = {};
	date: SHDate;
	time: any;
	fdow: number;
	selection: any;
	els: any = {};
	_bodyAnim: any;
	_menuVisible: any;
	_bluringTimeout: any;
	focused: any;
	_menuAnim: any;
	_focusEvents: any;
	_selRangeStart: any;
	_mouseDiff: any;
	_firstDateVisible: any = false;
	_lastDateVisible: any = false;
	_lastHoverDate: any = false;
	_showAnim: any;
	dateFormat: any;
	input_field: any;
	#lang: string = SHCalendar.defaultArgs.lang;
	static kcmonth: any;

	constructor(args: any = SHCalendar.defaultArgs, date: SHDate = new SHDate()) {
		this.args = this.mergeData(args, SHCalendar.defaultArgs);
		this.date = date;
		this.args.min = this.setDate(this.args.min);
		this.args.max = this.setDate(this.args.max);
		if (this.args.time === true)
			this.time =
				this.date.getHours() * 1e2 +
				Math.trunc(this.date.getMinutes() / this.args.minuteStep) *
					this.args.minuteStep;
		this.fdow = this.args.fdow;
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
				this.args.inputField,
				this.args.dateFormat
			); //popup
	}

	mergeData(data: any, defaults: any): any {
		//E()
		return { ...defaults, ...data };
	}

	getElementById(el: HTMLElement | string): HTMLElement {
		if (typeof el == "string")
			return document.getElementById(el) as HTMLElement;
		else if (el instanceof HTMLElement) return el;
		return document.createElement("shcalendar");
	}

	setDate(date: SHDate | string | number) {
		//k()
		if (typeof date == "number") return SHCalendar.intToDate(date);
		if (typeof date == "string") {
			const [year, month, day] = date.split(/-/);
			return new SHDate(+year, +month - 1, +day, 12);
		}
		return date;
	}

	setHandler() {
		//q()
		const event = [
			"onChange",
			"onSelect",
			"onTimeChange",
			"onFocus",
			"onBlur",
			"onClose"
		];
		for (const key in event) {
			const evn: any = event[key];
			this.handlers[key] = evn instanceof Array ? evn : [evn];
		}
	}

	init(): HTMLElement {
		var el = this.getElementById(this.args.cont);
		const els = this.els;
		const events: any = {
			mousedown: (event: any) => this.mouseClick(true, event),
			mouseup: (event: any) => this.mouseClick(false, event),
			mouseover: (event: any) => this.mouseHover(true, event),
			mouseout: (event: any) => this.mouseHover(false, event),
			keypress: (event: KeyboardEvent) => this.keypress(event)
		};
		const events_IE: any = SHCalendar.IS_IE
			? {
					dblclick: events.mousedown,
					keydown: events.keypress
			  }
			: {};

		const events_wheel: any = !this.args.noScroll
			? SHCalendar.IS_GECKO
				? {
						DOMMouseScroll: (event: any) => this.wheelCHTime(event)
				  }
				: {
						mousewheel: (event: any) => this.wheelCHTime(event)
				  }
			: {};
		el.innerHTML = this.template();
		this.setNode(el.firstChild, (el: any) => {
			var class_name = this.#top_class[el.className];
			if (class_name) els[class_name] = el;
			if (SHCalendar.IS_IE) el.setAttribute("unselectable", "on");
		});
		this.addEvent(els.main, { ...events, ...events_IE, ...events_wheel });
		this._focusEvents = {
			focus: (event: any) => this.onFocus(),
			blur: (event: any) => this.onBluringTimeout()
		};
		this.addEvent(els.focusLink, this._focusEvents);
		els.yearInput && this.addEvent(els.yearInput, this._focusEvents);

		this.moveTo(this.date, false);
		this.setTime(null, true);
		return els.topCont;
	}

	createElement(type: any, className?: any, parent?: any) {
		//createElement(type, parent)
		var el: HTMLElement; //el
		el = document.createElementNS
			? document.createElementNS("http://www.w3.org/1999/xhtml", type)
			: document.createElement(type);
		if (className) el.className = className;
		if (parent) parent.appendChild(el);
		return el;
	}

	addEvent(el: any, evname: any, callback?: any, useCapture?: any) {
		var i: number | string;
		// if (el instanceof Array)
		// 	for (i = el.length - 1; i >= 0; i--)
		// 		this.addEvent(el[i], evname, callback, useCapture);else
		if ("object" == typeof evname)
			for (i in evname)
				if (evname.hasOwnProperty(i)) this.addEvent(el, i, evname[i], callback);
		//if (el)
		if (el.addEventListener)
			el.addEventListener(
				evname,
				callback
				//SHCalendar.IS_IE ? true : !!useCapture
			);
		else if (el.attachEvent) el.attachEvent("on" + evname, callback);
		else el["on" + evname] = callback;
	}
	stopEvent(event: any) {
		if (event.stopPropagation) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			//SHCalendar.IS_IE
			event.cancelBubble = true; // For IE
			event.returnValue = false; // For IE
		}
		return false;
	}

	removeEvent(el: any, evname: any, callback?: any, useCapture?: any) {
		// if (el instanceof Array)
		// 	for (i = el.length - 1; i >= 0; i--)
		// 		this.removeEvent(el[i], evname, callback, useCapture);else
		if (typeof evname === "object") {
			for (var key in evname) {
				if (evname.hasOwnProperty(key)) {
					this.removeEvent(el, key, evname[key], callback);
				}
			}
		} else {
			if (el.removeEventListener) {
				el.removeEventListener(
					evname,
					callback,
					SHCalendar.IS_IE ? true : !!useCapture
				);
				//
			} else if (el.detachEvent) {
				el.detachEvent("on" + evname, callback);
			} else {
				el["on" + evname] = null;
			}
		}
	}

	addEventListener(evname: string, func: Function) {
		this.handlers[evname].push(func);
	}

	removeEventListener(evname: string, func: Function) {
		var evn = this.handlers[evname];
		for (var i = evn.length - 1; i >= 0; i--)
			if (evn[i] === func) evn.splice(i, 1);
	}

	setNode(els: any, callback: Function) {
		//W
		if (!callback(els))
			for (var el = els.firstChild; el; el = el.nextSibling)
				if (el.nodeType == 1) this.setNode(el, callback);
	}

	mouseClick(io: boolean, event: MouseEvent | any) {
		var timeOut: any, selection: any, events: any, el_date: any;
		const el_type = this.getAttributeType(event);
		if (el_type && !el_type.getAttribute("disabled")) {
			const shc_btn = el_type.getAttribute("shc-btn");
			const shc_type = el_type.getAttribute("shc-type");
			const shc_date = el_type.getAttribute("shc-date");
			selection = this.selection;
			if (io) {
				events = {
					mouseover: (event: any) => this.stopEvent(event),
					mousemove: (event: any) => this.stopEvent(event),
					mouseup: (event?: any) => {
						const shc_cls = el_type.getAttribute("shc-cls");
						if (shc_cls) this.removeClass(el_type, this.getClass(shc_cls, 1));
						clearTimeout(timeOut);
						this.removeEvent(document, events); //, true
						events = null;
					}
				};
				setTimeout(() => this.focus(), 1);
				const shc_cls = el_type.getAttribute("shc-cls");
				if (shc_cls) this.addClass(el_type, this.getClass(shc_cls, 1));
				if ("menu" == shc_btn) {
					this.toggleMenu();
				} else if (el_type && /^[+-][MY]$/.test(shc_btn)) {
					if (this.stepDate(shc_btn)) {
						const time_out = () => {
							if (this.stepDate(shc_btn, true)) {
								timeOut = setTimeout(time_out, 40);
							} else {
								events.mouseup();
								this.stepDate(shc_btn);
							}
						};
						timeOut = setTimeout(time_out, 350);
						this.addEvent(document, events); //, true
					} else events.mouseup();
				} else if ("year" == shc_btn) {
					this.els.yearInput.focus();
					this.els.yearInput.select();
				} else if ("time-am" == shc_type) {
					this.addEvent(document, events); //, true
				} else if (/^time/.test(shc_type)) {
					const time_out = (type: string = shc_type) => {
						this.stepTime(type);
						timeOut = setTimeout(time_out, 1e2);
					};
					this.stepTime(shc_type);
					timeOut = setTimeout(time_out, 350);
					this.addEvent(document, events); //, true
				} else if (shc_date && selection.type) {
					if (selection.type == SelectionType.MULTIPLE) {
						if (event.shiftKey && this._selRangeStart) {
							selection.selectRange(this._selRangeStart, shc_date);
						} else if (
							event.ctrlKey ||
							selection.isSelected(shc_date) ||
							!this.args.multiCtrl
						) {
							selection.clear(true);
							selection.set(shc_date, true);
							this._selRangeStart = shc_date;
						}
					} else {
						selection.set(shc_date);
						this.moveTo(SHCalendar.intToDate(shc_date), 2);
					}
					el_date = this.getElementDate(shc_date);
					this.mouseHover(true, { target: el_date });
					this.addEvent(document, events); //, true
				}
				if (SHCalendar.IS_IE && events && /dbl/i.test(event.type)) {
					events.mouseup();
				}
				if (
					this.args.fixed ||
					(el_date &&
						!/^(SHCalendar-(topBar|bottomBar|weekend|weekNumber|menu(-sep)?))?$/.test(
							el_date.className
						)) ||
					this.args.cont
				) {
					this._mouseDiff = this.position(
						event,
						this.getAbsolutePos(this.els.topCont)
					);
					this.addEvent(document, events); //, true
				}
			} else if ("today" == shc_btn) {
				if (!(this._menuVisible || selection.type != SelectionType.SINGLE))
					selection.set(new SHDate());
				this.moveTo(new SHDate(), true);
				this.showMenu(false);
			} else if (/^m([0-9]+)/.test(shc_btn)) {
				const shc_date = new SHDate(this.date);
				shc_date.setFullYear(
					this._getInputYear(),
					+shc_btn.replace(/^m([0-9]+)/, "$1"),
					1
				);
				this.moveTo(shc_date, true);
				this.showMenu(false);
			} else if ("time-am" == shc_type) {
				this.setHours(this.date.getHours() + 12);
				if (!SHCalendar.IS_IE) this.stopEvent(event);
			}
		}
	}

	mouseHover(io: boolean, event: MouseEvent | any) {
		// D()
		var el_type: any, shc_type: string, shc_cls: string;
		el_type = this.getAttributeType(event);
		if (el_type) {
			shc_type = el_type.getAttribute("shc-type");
			if (shc_type && !el_type.getAttribute("disabled")) {
				if (!(io && this._bodyAnim && "date" == shc_type)) {
					if ("date" != shc_type || this.selection.type) {
						shc_cls = el_type.getAttribute("shc-cls");
						shc_cls = shc_cls
							? this.getClass(shc_cls, 0)
							: "SHCalendar-hover-" + shc_type;
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
					if (this._lastHoverDate)
						this.removeClass(
							this.getElementDate(this._lastHoverDate),
							"SHCalendar-hover-date"
						);
					this._lastHoverDate = false;
				}
			}
		}
		if (!io) this._showTooltip();
	}

	wheelCHTime(event: any) {
		//https://rbyers.github.io/scroll-latency.html
		// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
		// b()
		var el_type, shc_btn, el_type, wheelStep, shc_type;
		el_type = this.getAttributeType(event);
		if (el_type) {
			shc_btn = el_type.getAttribute("shc-btn");
			shc_type = el_type.getAttribute("shc-type");
			wheelStep = event.wheelDelta ? event.wheelDelta / 120 : -event.detail / 3;
			wheelStep = 0 > wheelStep ? -1 : wheelStep > 0 ? 1 : 0;
			if (this.args.reverseWheel) wheelStep = -wheelStep;
			if (/^(time-(hour|min))/.test(shc_type)) {
				switch (RegExp.$1) {
					case "time-hour":
						this.setHours(this.date.getHours() + wheelStep);
						break;
					case "time-min":
						this.setMinutes(
							this.date.getMinutes() + this.args.minuteStep * wheelStep
						);
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
			MN,
			month_name: string,
			d,
			m;
		if (!this._menuAnim) {
			target = event.target;
			shc_btn = target.getAttribute("shc-btn");
			key_code = event.keyCode;
			char_code = event.charCode || key_code;
			r = this.#control_key[key_code];
			if ("year" == shc_btn && 13 == key_code) {
				date = new SHDate(this.date);
				date.setDate(1);
				date.setFullYear(this._getInputYear());
				this.moveTo(date, true);
				this.showMenu(false);
				return this.stopEvent(event);
			}
			if (this._menuVisible) {
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
					this.focus();
					yearInput.focus();
					yearInput.select();
					return this.stopEvent(event);
				}
				if (char_code >= "0" && "9" >= char_code) {
					this.showMenu(true);
					this.focus();
					yearInput.value = char_code;
					yearInput.focus();
					return this.stopEvent(event);
				}
				month_name = this.getLanguage("mn");
				d = event.shiftKey ? -1 : this.date.getMonth();
				for (m = 0; ++m < 12; ) {
					MN = month_name[(d + m) % 12].toLowerCase();
					if (MN.indexOf(char_code) == 0) {
						date = new SHDate(this.date);
						date.setDate(1);
						date.setMonth((d + m) % 12);
						this.moveTo(date, true);
						return this.stopEvent(event);
					}
				}
				if (key_code >= 37 && 40 >= key_code) {
					date_int = this._lastHoverDate;
					if (!(date_int || selection.isEmpty())) {
						date_int =
							39 > key_code
								? selection.getFirstDate()
								: selection.getLastDate();
						if (
							date_int < this._firstDateVisible ||
							date_int > this._lastDateVisible
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
							date_int < this._firstDateVisible ||
							date_int > this._lastDateVisible
						)
							this.moveTo(date_int);
					} else
						date_int =
							39 > key_code ? this._lastDateVisible : this._firstDateVisible;
					this.removeClass(
						this.getElementDate(date_int),
						this.addClass(
							this.getElementDate(date_int),
							"SHCalendar-hover-date"
						)
					);
					this._lastHoverDate = date_int;
					return this.stopEvent(event);
				}
				if (13 == key_code && this._lastHoverDate) {
					selection.type == SelectionType.MULTIPLE &&
					(event.shiftKey || event.ctrlKey)
						? (event.shiftKey &&
								this._selRangeStart &&
								(selection.clear(true),
								selection.selectRange(
									this._selRangeStart,
									this._lastHoverDate
								)),
						  event.ctrlKey &&
								selection.set(
									(this._selRangeStart = this._lastHoverDate),
									true
								))
						: selection.reset((this._selRangeStart = this._lastHoverDate));
					return this.stopEvent(event);
				}
				27 != key_code || this.args.cont || this.hide();
			}
		}
	}

	redraw() {
		this.refresh();
		const { dayNames, menu, bottomBar, topCont } = this.els;
		dayNames.innerHTML = this.Weeks();
		menu.innerHTML = this.Menu();
		if (bottomBar) bottomBar.innerHTML = this.BottomBar();
		this.setNode(topCont, (el: any) => {
			var cls = this.#top_class[el.className];
			if (cls) this.els[cls] = el;
			if (el.className == "SHCalendar-menu-year") {
				this.addEvent(el, this._focusEvents);
				this.els.yearInput = el;
			} else if (SHCalendar.IS_IE) el.setAttribute("unselectable", "on");
		});
		this.setTime(null, true);
	}

	focus() {
		const { yearInput, focusLink } = this.els;
		try {
			if (this._menuVisible) yearInput.focus();
			else focusLink.focus();
		} catch (err) {}
		this.onFocus();
	}

	onFocus() {
		//c
		const { main } = this.els;
		if (this._bluringTimeout) clearTimeout(this._bluringTimeout);
		this.focused = true;
		this.addClass(main, "SHCalendar-focused");
		this.callHooks("onFocus");
	}

	blur() {
		const { yearInput, focusLink } = this.els;
		focusLink.blur();
		yearInput.blur();
		this.onBlur();
	}

	onBlur() {
		//h
		this.focused = false;
		const { main } = this.els;
		this.removeClass(main, "SHCalendar-focused");
		if (this._menuVisible) this.showMenu(false);
		if (!this.args.cont) this.hide();
		this.callHooks("onBlur");
	}

	onBluringTimeout() {
		//u
		this._bluringTimeout = setTimeout(() => {
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
		const { timeAM, timeHour } = this.els;
		if (0 > H24) {
			H24 += 24;
		}
		//this.setTime(1e2 * (H % 24) + (this.time % 1e2));

		this.date.setHours(H24);
		if (this.args.showTime == 12) {
			if (0 == H24) {
				H24 = 12;
			}
			if (H24 > 12) {
				H24 -= 12;
			}
			timeAM.innerHTML = this.getLanguage(12 > H24 ? "AM" : "PM");
		}
		timeHour.innerHTML = H24.toString().padStart(2, "0");
	}

	setMinutes(minute: number) {
		if (minute < 0) minute += 60;
		const { minuteStep } = this.args;
		minute = Math.trunc(minute / minuteStep) * minuteStep;
		//this.setTime(1e2 * this.date.getHours() + (M % 60));
		this.date.setMinutes(minute);
		const { timeMinute } = this.els;
		timeMinute.innerHTML = minute.toString().padStart(2, "0");
	}

	setTime(time: number | null, nohooks: boolean = false) {
		const { inputField, showTime, dateFormat } = this.args;
		if (showTime) {
			this.time = time !== null ? time : this.time;
			if (!nohooks) {
				this.callHooks("onTimeChange", this.time);
				if (inputField) {
					inputField[
						inputField.tagName.toLowerCase() === "input" ? "value" : "innerHTML"
					] = this.selection.print(dateFormat);
				}
			}
		}
	}

	stepTime(shc_type: string) {
		// d()
		const { minuteStep } = this.args;
		switch (shc_type) {
			case "time-hour+":
				this.setHours(this.date.getHours() + 1);
				break;
			case "time-hour-":
				this.setHours(this.date.getHours() - 1);
				break;
			case "time-min+":
				this.setMinutes(this.date.getMinutes() + minuteStep);
				break;
			case "time-min-":
				this.setMinutes(this.date.getMinutes() - minuteStep);
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
		//A()
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
		let el_s: HTMLElement | false = false;
		if (shc_date) {
			this.setNode(this.els.body, (el: HTMLElement) => {
				if (el.getAttribute("shc-date") == shc_date) {
					el_s = el;
				}
			});
		}
		return el_s;
	}

	Animation(args: any, e?: any, n: number = 0) {
		//animation

		args = this.mergeData(args, {
			fps: 50,
			len: 15,
			onUpdate: () => {},
			onStop: () => {}
		});
		if (SHCalendar.IS_IE) args.len = Math.round(args.len / 2);

		const result = {
			map: (t: number, e: number, n: number, a: number) => {
				if (a) return n + t * (e - n);
				return e + t * (n - e);
			},
			update: () => {
				const e = args.len;
				args.onUpdate(n / e, result.map);
				if (n === e) result.stop();
				n++;
			},
			start: () => {
				if (e) result.stop();
				n = 0;
				e = setInterval(result.update, 1000 / args.fps);
			},
			stop: () => {
				if (e) {
					clearInterval(e);
					e = null;
				}
				args.onStop(n / args.len, result.map);
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

	moveTo(date: SHDate | number | string, animation?: boolean | number) {
		//date , animation
		var a: any,
			min: any = false,
			max: any = false,
			math_animation: any,
			body_offset: any,
			el_clone_node: any,
			el_clone_node_style: any;
		//   v,
		date = this.setDate(date);
		let compare_date = this.compareDate(date, this.date, true);
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
		if (args_min) min = this.compareDate(date, args_min);
		if (args_max) max = this.compareDate(date, args_max);
		if (!args_animation) animation = false;
		this.toggleClass(
			false != min && 1 >= min,
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
			a = 1;
			compare_date = 0;
		}
		if (max > 1) {
			date = args_max;
			a = 2;
			compare_date = 0;
		}
		this.date = SHCalendar.intToDate(date);
		this.refresh(!!animation);
		this.callHooks("onChange", date, animation);
		if (!(!animation || (0 == compare_date && 2 == animation))) {
			if (this._bodyAnim) this._bodyAnim.stop();
			const {
				firstChild: body_first_child,
				offsetHeight: body_offset_height,
				offsetWidth: body_offset_width
			} = els_body;
			const el = this.createElement(
				"div",
				"SHCalendar-animBody-" + this.#control_button[compare_date],
				els_body
			);
			this.setOpacity(body_first_child, 0.7);
			if (a) math_animation = this.#math_animation.brakes;
			else if (0 == compare_date) math_animation = this.#math_animation.shake;
			else math_animation = this.#math_animation.accel_ab2;
			const ddbool = compare_date * compare_date > 4;
			const body_first_child_offset = ddbool
				? body_first_child.offsetTop
				: body_first_child.offsetLeft;
			const el_style = el.style;
			var body_offset = ddbool ? body_offset_height : body_offset_width;
			if (compare_date < 0) body_offset += body_first_child_offset;
			else if (compare_date > 0)
				body_offset = body_first_child_offset - body_offset;
			else {
				body_offset = Math.round(body_offset / 7);
				2 == a && (body_offset = -body_offset);
			}
			if (!(a || 0 == compare_date)) {
				el_clone_node = el.cloneNode(true);
				el_clone_node_style = el_clone_node.style;
				//v = 2 * body_offset;
				el_clone_node.appendChild(body_first_child.cloneNode(true));
				el_clone_node_style[ddbool ? "marginTop" : "marginLeft"] =
					body_offset + "px";
				els_body.appendChild(el_clone_node);
			}
			body_first_child.style.visibility = "hidden";
			el.innerHTML = this.Day();
			const tis = this;
			this._bodyAnim = this.Animation({
				onUpdate: function (t: number, e: Function) {
					var n: any,
						i = math_animation(t);
					if (el_clone_node) n = e(i, body_offset, 2 * body_offset) + "px";
					if (a)
						el_style[ddbool ? "marginTop" : "marginLeft"] =
							e(i, body_offset, 0) + "px";
					else {
						if (ddbool || 0 == compare_date) {
							el_style.marginTop =
								e(
									0 == compare_date ? math_animation(t * t) : i,
									0,
									body_offset
								) + "px";
							if (0 != compare_date) el_clone_node_style.marginTop = n;
						}
						if (!(ddbool && 0 != compare_date)) {
							el_style.marginLeft = e(i, 0, body_offset) + "px";
							if (0 != compare_date) el_clone_node_style.marginLeft = n;
						}
					}
					if (args_opacity > 2 && el_clone_node) {
						tis.setOpacity(el_clone_node, 1 - i);
						tis.setOpacity(el, i);
					}
				},
				onStop: function () {
					els_body.innerHTML = tis.Day(tis.date);
					tis._bodyAnim = null;
				}
			});
		}
		this._lastHoverDate = false;
		return min >= -1 && max <= 1;
	}

	isDisabled(date: SHDate) {
		const { min, max, disabled } = this.args;
		if (min && this.compareDate(date, min) < 0) {
			return true;
		} else if (max && this.compareDate(date, max) > 0) {
			return true;
		} else if (disabled) {
			return this.args.disabled(date);
		}
		return false;
	}

	toggleMenu() {
		this.showMenu(!this._menuVisible);
	}

	refresh(noBody = false) {
		const { body, title, yearInput } = this.els;
		if (!noBody) body.innerHTML = this.Day();
		title.innerHTML = this.Title();
		if (yearInput) yearInput.value = this.date.getFullYear();
	}

	showMenu(visible: boolean) {
		const { menu, title, main, topBar } = this.els;
		this._menuVisible = visible;
		this.toggleClass(visible, title, "SHCalendar-pressed-title");
		if (menu) {
			if (SHCalendar.IS_IE6) menu.style.height = main.offsetHeight + "px";
			if (this.args.animation) {
				if (this._menuAnim) this._menuAnim.stop();
				const offset_height = main.offsetHeight;
				if (SHCalendar.IS_IE6) menu.style.width = topBar.offsetWidth + "px";
				if (visible) {
					menu.firstChild.style.marginTop = -offset_height + "px";
					if (this.args.opacity > 0) this.setOpacity(menu, 0);
					this.styleDisplay(menu, true);
				}
				const tis = this;
				this._menuAnim = this.Animation({
					onUpdate: (s: number, i: Function) => {
						menu.firstChild.style.marginTop =
							i(tis.#math_animation.accel_b(s), -offset_height, 0, !visible) +
							"px";
						if (tis.args.opacity > 0)
							tis.setOpacity(
								menu,
								i(tis.#math_animation.accel_b(s), 0, 0.85, !visible)
							);
					},
					onStop: () => {
						if (tis.args.opacity > 0) tis.setOpacity(menu, 0.85);
						menu.firstChild.style.marginTop = "";
						tis._menuAnim = null;
						if (!visible) {
							tis.styleDisplay(menu, false);
							if (tis.focused) tis.focus();
						}
					}
				});
			} else {
				this.styleDisplay(menu, visible);
				if (this.focused) this.focus();
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

	compareDate(
		first_date: SHDate,
		second_date: SHDate,
		is_day: boolean = false
	) {
		const yearComparison = first_date.getFullYear() - second_date.getFullYear();
		if (yearComparison !== 0) {
			return yearComparison > 0 ? -3 : 3;
		}
		const monthComparison = first_date.getMonth() - second_date.getMonth();
		if (monthComparison !== 0) {
			return monthComparison > 0 ? -2 : 2;
		}
		if (is_day) {
			const dayComparison = first_date.getDate() - second_date.getDate();
			if (dayComparison !== 0) {
				return dayComparison > 0 ? -1 : 1;
			}
		}
		return 0;
	}

	stepDate(shc_btn: any, anim?: any) {
		if (this._bodyAnim) this._bodyAnim.stop();
		const date = shc_btn ? new SHDate(this.date) : new SHDate();
		switch (shc_btn) {
			case "-Y":
			case -2:
				date.setFullYear(date.getFullYear() - 1, date.getMonth(), 1);
				break;
			case "-M":
			case -1:
				date.setFullYear(date.getFullYear(), date.getMonth() - 1, 1);
				break;
			case "+Y":
			case 2:
				date.setFullYear(date.getFullYear() + 1, date.getMonth(), 1);
				break;
			case "+M":
			case 1:
				date.setFullYear(date.getFullYear(), date.getMonth() + 1, 1);
		}
		return this.moveTo(date, !anim);
	}

	hide() {
		this.callHooks("onClose", this);
		var top_cont = this.els.topCont,
			first_child = this.els.body.firstChild;
		if (this.args.animation) {
			if (this._showAnim) this._showAnim.stop();
			const tis = this;
			this._showAnim = this.Animation({
				onUpdate: (i: number, r: Function) => {
					if (tis.args.opacity > 1) tis.setOpacity(top_cont, 1 - i);
					first_child.style.marginTop =
						-r(tis.#math_animation.accel_b(i), 0, first_child.offsetHeight) +
						"px";
					top_cont.style.top =
						r(
							tis.#math_animation.accel_ab(i),
							tis.getAbsolutePos(top_cont).y,
							tis.getAbsolutePos(top_cont).y - 10
						) + "px";
				},
				onStop: () => {
					top_cont.style.display = "none";
					first_child.style.marginTop = "";
					if (tis.args.opacity > 1) tis.setOpacity(top_cont, "");
					tis._showAnim = null;
				}
			});
		} else {
			top_cont.style.display = "none";
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
						this.printDate(date, dateInfo.tooltip) +
						"</div>";
				}
			}
		}
		if (this.els.tooltip) {
			this.els.tooltip.innerHTML = template;
		}
	}
	printDate(date: SHDate = this.date, str: string): string {
		let month = date.getMonth(),
			day = date.getDate(),
			year = date.getFullYear(),
			woy = date.getWeekOfYear()[1],
			dow = date.getDay(),
			hours = date.getHours(),
			h12 = hours >= 12 ? hours - 12 : hours || 12,
			doy = this.getDayOfYear(date),
			minutes = date.getMinutes(),
			second = date.getSeconds(),
			data = new Map([
				["%a", this.getLanguage("sdn")[dow]],
				["%A", this.getLanguage("dn")[dow]],
				["%b", this.getLanguage("smn")[month]],
				["%B", this.getLanguage("mn")[month]],
				["%C", 1 + Math.trunc(year / 1e2)],
				["%d", day < 10 ? "0" + day : day],
				["%e", day],
				["%H", hours < 10 ? "0" + hours : hours],
				["%I", h12 < 10 ? "0" + h12 : h12],
				["%j", doy < 10 ? "00" + doy : doy < 1e2 ? "0" + doy : doy],
				["%k", hours],
				["%l", h12],
				["%m", month < 9 ? "0" + (1 + month) : 1 + month],
				["%o", 1 + month],
				["%M", minutes < 10 ? "0" + minutes : minutes],
				["%n", "\n"],
				["%p", hours >= 12 ? "PM" : "AM"],
				["%P", hours >= 12 ? "pm" : "am"],
				["%s", Math.trunc(date.getTime() / 1e3)],
				["%S", second < 10 ? "0" + second : second],
				["%t", "	"],
				["%U", woy < 10 ? "0" + woy : woy],
				["%W", woy < 10 ? "0" + woy : woy],
				["%V", woy < 10 ? "0" + woy : woy],
				["%u", dow + 1],
				["%w", dow],
				["%y", ("" + year).substring(2, 3)],
				["%Y", year],
				["%%", "%"]
			]);
		return str.replace(/%./g, (t) => (data.has(t) ? data.get(t) : t));
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
			? (null == month && (month = d.shift()), null == day && (day = d.shift()))
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
		const e = (e: string | any[]) => {
			for (const lang of ["smn", "mn"]) {
				for (let i = 0; i < e.length; i++) {
					if (e[i].toLowerCase().startsWith(t)) {
						return i + 1;
					}
				}
			}
		};

		return /\S/.test(t)
			? ((t = t.toLowerCase()),
			  e(this.getLanguage("smn")) || e(this.getLanguage("mn")))
			: void 0;
	}

	static isUnicodeLetter(str: string) {
		return str.toLowerCase() !== str.toUpperCase();
	}

	getLanguage(name: string, lang: string = this.#lang): any {
		switch (name) {
			case "fdow":
				return Word.getFirstDayOfWeek(lang) as number;
			case "isrtl":
				return Word.isRTL(lang) as boolean;
			case "goToday":
				return Word.getGoToday(lang) as string;
			case "today":
				return Word.getToday(lang) as string;
			case "wk":
				return Word.getWeekName(lang) as string;
			case "weekend":
				return Word.getWeekend(lang) as number | number[];
			case "AM":
				return Word.getAM(lang) as string;
			case "PM":
				return Word.getPM(lang) as string;
			case "mn":
				return Word.getMonthName(lang) as string[];
			case "smn":
				return Word.getShortMonthName(lang) as string[];
			case "dn":
				return Word.getDayName(lang) as string[];
			case "sdn":
				return Word.getshortDayName(lang) as string[];
		}
	}

	setLanguage(lang: string) {
		this.fdow = Word.getFirstDayOfWeek();
		this.redraw();
	}

	getDayOfYear(date: SHDate) {
		return date.getDayOfYear();
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
			this.printDate(this.date, this.args.titleFormat) +
			"</div>"
		);
	}

	Menu() {
		const yearInput =
			"<input shc-btn='year' class='SHCalendar-menu-year' size='6' value='" +
			this.date.getFullYear() +
			"' />";
		const todayButton =
			"<div shc-type='menubtn' shc-cls='hover-navBtn,pressed-navBtn' shc-btn='today'>" +
			this.getLanguage("goToday") +
			"</div>";
		const monthShortName = this.getLanguage("smn");
		var month = 0;
		const monthTable =
			"<table class='SHCalendar-menu-mtable' align='center' cellspacing='0' cellpadding='0'>" +
			Array.from({ length: 4 }, (_, i) => {
				const monthButtons = Array.from({ length: 3 }, (_, j) => {
					return `<td><div shc-type='menubtn' shc-cls='hover-navBtn,pressed-navBtn' shc-btn='m${month}' class='SHCalendar-menu-month'>${
						monthShortName[month++]
					}</div></td>`;
				}).join("");
				return `<tr>${monthButtons}</tr>`;
			}).join("") +
			"</table>";

		return `<table height='1e2%' align='center' cellspacing='0' cellpadding='0'><tr><td><table style='margin-top: 1.5em' align='center' cellspacing='0' cellpadding='0'><tr><td colspan='3'>${yearInput}</td><td><div shc-type='menubtn' shc-cls='hover-navBtn,pressed-navBtn' shc-btn='today'>${this.date.getFullYear()}</div></td></tr><tr><td>${todayButton}</td></tr></table><p class='SHCalendar-menu-sep'>&nbsp;</p>${monthTable}</td></tr></table>`;
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
			}>${this.getLanguage("sdn")[day]}</div></td>`;
		}).join("");

		return `<table align='center' cellspacing='0' cellpadding='0'><tr>${weekNumber}${daysOfWeek}</tr></table>`;
	}

	isWeekend(day: number): boolean {
		return this.getLanguage("weekend").indexOf(day) >= 0;
	}

	Day(date: SHDate = this.date, fdow: number = this.fdow) {
		const today = new SHDate();
		const year_today = today.getFullYear();
		const month_today = today.getMonth();
		const day_today = today.getDate();
		const fulldate_today =
			1e4 * year_today + 1e2 * (month_today + 1) + day_today;
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
						this._firstDateVisible = fulldate;
					}
				}
				if (vertical === 6) {
					template.push(" SHCalendar-last-col");
					if (horizontal === 5) this._lastDateVisible = fulldate;
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
				this.getLanguage("today"),
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
		// C
		var field: { tagName: string; value: any; innerHTML: any },
			sel: { print: (arg0: any) => any },
			print: any;
		this.refresh();
		field = this.input_field;
		sel = this.selection;
		if (field) {
			print = sel.print(this.dateFormat);
			/input|textarea/i.test(field.tagName)
				? (field.value = print)
				: (field.innerHTML = print);
		}
		this.callHooks("onSelect", this, sel);
	}

	popupForField(trigger: string, field: string, date_format: string) {
		var date: any, i: any, r: any, el_field: any, el_trigger: any;
		el_field = this.getElementById(field);
		el_trigger = this.getElementById(trigger);
		this.input_field = el_field;
		this.dateFormat = date_format;
		if (this.selection.type == SelectionType.SINGLE) {
			date = /input|textarea/i.test(el_field.tagName)
				? el_field.value
				: el_field.innerText || el_field.textContent;
			if (date) {
				(i = /(^|[^%])%[bBmo]/.exec(date_format)),
					(r = /(^|[^%])%[de]/.exec(date_format));
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
		var el_trigger: any, el_field: any;
		el_field = this.getElementById(field);
		el_trigger = this.getElementById(trigger);
		if (/^button$/i.test(el_trigger.tagName))
			el_trigger.setAttribute("type", "button");
		this.addEvent(el_trigger, "click", (event: any) => {
			this.popupForField(el_trigger, el_field, date_format);
			return this.stopEvent(event);
		});
	}

	popup(trigger: any, align?: any) {
		const alignment = (align: any) => {
			var pos: any = { x: offset.x, y: offset.y };
			if (align) {
				// vertical alignment
				if (/B/.test(align)) pos.y += el_trigger.offsetHeight;
				if (/b/.test(align))
					pos.y += el_trigger.offsetHeight - top_cont_offset.y;
				if (/T/.test(align)) pos.y -= top_cont_offset.y;
				if (/m/i.test(align))
					pos.y += (el_trigger.offsetHeight - top_cont_offset.y) / 2;
				// horizontal alignment
				if (/l/.test(align))
					pos.x -= top_cont_offset.x - el_trigger.offsetWidth;
				if (/L/.test(align)) pos.x -= top_cont_offset.x;
				if (/R/.test(align)) pos.x += el_trigger.offsetWidth;
				if (/c/i.test(align))
					pos.x += (el_trigger.offsetWidth - top_cont_offset.x) / 2;
				return pos;
			} else return pos;
		};
		var top_cont_offset: any,
			trigger_offset: any,
			top_cont: any,
			top_cont_style: any,
			position_mouse: any,
			offset: any,
			el_trigger: any;
		this.showAt(0, 0);
		top_cont = this.els.topCont;
		top_cont_style = top_cont.style;
		top_cont_style.visibility = "hidden";
		top_cont_style.display = "";
		document.body.appendChild(top_cont);
		top_cont_offset = {
			x: top_cont.offsetWidth,
			y: top_cont.offsetHeight
		};
		el_trigger = this.getElementById(trigger);
		trigger_offset = this.getAbsolutePos(el_trigger);
		offset = trigger_offset;
		if (!align) align = this.args.align;
		align = align.split(/\x2f/);
		offset = alignment(align[0]);
		position_mouse = this.positionMouse();
		if (offset.y < position_mouse.y) {
			offset.y = trigger_offset.y;
			offset = alignment(align[1]);
		}
		if (offset.x + top_cont_offset.x > position_mouse.x + position_mouse.w) {
			offset.x = trigger_offset.x;
			offset = alignment(align[2]);
		}
		if (offset.y + top_cont_offset.y > position_mouse.y + position_mouse.h) {
			offset.y = trigger_offset.y;
			offset = alignment(align[3]);
		}
		if (offset.x < position_mouse.x) {
			offset.x = trigger_offset.x;
			offset = alignment(align[4]);
		}
		this.showAt(offset.x, offset.y, true);
		top_cont_style.visibility = "";
		this.focus();
	}

	showAt(lpos: any, tpos: any, banim?: any) {
		if (this._showAnim) this._showAnim.stop();
		banim = banim && this.args.animation;
		var top_cont = this.els.topCont,
			first_child = this.els.body.firstChild,
			offsetHeight = first_child.offsetHeight,
			top_cont_style = top_cont.style;
		top_cont_style.position = "absolute";
		top_cont_style.left = lpos + "px";
		top_cont_style.top = tpos + "px";
		top_cont_style.zIndex = 1e4;
		top_cont_style.display = "";
		if (banim) {
			first_child.style.marginTop = -offsetHeight + "px";
			if (this.args.opacity > 1) {
				this.setOpacity(top_cont, 0);
				const tis = this;
				this._showAnim = this.Animation({
					onUpdate: function (t: any, e: any) {
						first_child.style.marginTop =
							-e(tis.#math_animation.accel_b(t), offsetHeight, 0) + "px";
						if (tis.args.opacity > 1) tis.setOpacity(top_cont, t);
					},
					onStop: function () {
						if (tis.args.opacity > 1) tis.setOpacity(top_cont, "");
						tis._showAnim = null;
					}
				});
			}
		}
	}

	getAbsolutePos(el: any) {
		//G()
		var BCR,
			osl = 0,
			ost = 0;
		if (el.getBoundingClientRect)
			return (
				(BCR = el.getBoundingClientRect()),
				{
					x:
						BCR.left -
						document.documentElement.clientLeft +
						document.body.scrollLeft,
					y:
						BCR.top -
						document.documentElement.clientTop +
						document.body.scrollTop
				}
			);
		do
			(osl += el.offsetLeft - el.scrollLeft),
				(ost += el.offsetTop - el.scrollTop);
		while ((el = el.offsetParent));
		return {
			x: osl,
			y: ost
		};
	}

	position(even: any, pos: any) {
		var x = SHCalendar.IS_IE
				? even.clientX + document.body.scrollLeft
				: even.pageX,
			y = SHCalendar.IS_IE
				? even.clientY + document.body.scrollTop
				: even.pageY;
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
		// p
		var style = this.els.topCont.style,
			pos = this.position(event, this._mouseDiff);
		style.left = pos.x + "px";
		style.top = pos.y + "px";
	}

	positionMouse() {
		//X
		var document_element = document.documentElement,
			document_body = document.body;
		return {
			x: document_element.scrollLeft || document_body.scrollLeft,
			y: document_element.scrollTop || document_body.scrollTop,
			w:
				document_element.clientWidth ||
				window.innerWidth ||
				document_body.clientWidth,
			h:
				document_element.clientHeight ||
				window.innerHeight ||
				document_body.clientHeight
		};
	}
}
