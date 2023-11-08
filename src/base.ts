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
		min: null,
		max: null,
		showTime: false,
		timePos: "right",
		minuteStep: 5,
		checkRange: false,
		animation: !SHCalendar.IS_IE6,
		opacity: SHCalendar.IS_IE ? 1 : 3,
		selection: [],
		selectionType: SelectionType.MULTIPLE,
		inputField: null,
		lang: "en_US",
		trigger: null,
		align: "Bl/ / /T/r",
		multiCtrl: true,
		fixed: false,
		reverseWheel: false,
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
				this.date.getHours() * 100 +
				Math.floor(this.date.getMinutes() / this.args.minuteStep) *
					this.args.minuteStep;
		this.fdow = this.args.fdow;
		this.setHandler();
		this.selection = new Selection(
			this.args.selection,
			this.args.selectionType,
			this
		);

		this.init();
		//this.args.trigger && this.manageFields(this.args.trigger,this.args.inputField, this.args.dateFormat),//popup
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
			return new SHDate(
				parseInt(year, 10),
				parseInt(month, 10) - 1,
				parseInt(day, 10),
				12
			);
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
		var els: any;
		var el = this.getElementById(this.args.cont);
		els = this.els = {};
		const events: any = {
			// mousedown: (event: any) => this.mouseClick(true, event),
			// mouseup: (event: any) => this.mouseClick(false, event),
			mouseover: (event: any) => this.mouseHover(true, event),
			mouseout: (event: any) => this.mouseHover(false, event)
			// keypress: (event: KeyboardEvent) => this.keypress(event)
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
						// DOMMouseScroll: (event: any) => this.wheelCHTime(event)
				  }
				: {
						// mousewheel: (event: any) => this.wheelCHTime(event)
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

	stopEvent(event: MouseEvent) {
		//stopEvent   N
		if (SHCalendar.IS_IE) {
			event.cancelBubble = true; // deprecated
			event.returnValue = false; // deprecated
		} else {
			event.preventDefault();
			event.stopPropagation();
		}
		return false;
	}

	removeEvent(el: any, evname: any, callback?: any, useCapture?: any) {
		//removeEvent   F
		var i: number | string;
		// if (el instanceof Array)
		// 	for (i = el.length - 1; i >= 0; i--)
		// 		this.removeEvent(el[i], evname, callback, useCapture);else
		if ("object" == typeof evname)
			for (i in evname)
				if (evname.hasOwnProperty(i))
					this.removeEvent(el, i, evname[i], callback);
		if (el)
			if (el.removeEventListener)
				el.removeEventListener(
					evname,
					callback
					//SHCalendar.IS_IE ? true : !!useCapture
				);
			else if (el.detachEvent) el.detachEvent("on" + evname, callback);
			else el["on" + evname] = null;
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
		var el_type: any,
			timeOut: any,
			shc_btn: any,
			shc_type: string,
			shc_date: any,
			selection: any,
			events: any,
			shc_cls: string,
			u: Function,
			el_date: any;
		el_type = this.getAttributeType(event);
		if (el_type && !el_type.getAttribute("disabled")) {
			shc_btn = el_type.getAttribute("shc-btn");
			shc_type = el_type.getAttribute("shc-type");
			shc_date = el_type.getAttribute("shc-date");
			selection = this.selection;
			if (io) {
				events = {
					mouseover: (event: any) => this.stopEvent(event),
					mousemove: (event: any) => this.stopEvent(event),
					mouseup: (event?: any) => {
						var shc_cls = el_type.getAttribute("shc-cls");
						if (shc_cls) this.removeClass(el_type, this.splitClass(shc_cls, 1));
						clearTimeout(timeOut);
						this.removeEvent(document, events); //, true
						events = null;
					}
				};
				setTimeout(() => this.focus(), 1);
				shc_cls = el_type.getAttribute("shc-cls");
				if (shc_cls) this.addClass(el_type, this.splitClass(shc_cls, 1));
				if ("menu" == shc_btn) {
					this.toggleMenu();
				} else if (el_type && /^[+-][MY]$/.test(shc_btn)) {
					if (this.changeDate(shc_btn)) {
						const time_out = () => {
							if (this.changeDate(shc_btn, true))
								timeOut = setTimeout(time_out, 40);
							else {
								events.mouseup();
								this.changeDate(shc_btn);
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
					const time_out = (t: string = shc_type) => {
						this.changeTime(t);
						timeOut = setTimeout(time_out, 100);
					};
					this.changeTime(shc_type);
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
					!/^(SHCalendar-(topBar|bottomBar|weekend|weekNumber|menu(-sep)?))?$/.test(
						el_date.className
					) ||
					this.args.cont
				) {
					events.mousemove = (event: any) => this.dragIt(event);
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
				shc_date = new SHDate(this.date);
				shc_date.setDate(1);
				shc_date.setMonth(parseInt(RegExp.$1));
				shc_date.setFullYear(this._getInputYear());
				this.moveTo(shc_date, true);
				this.showMenu(false);
			} else if ("time-am" == shc_type) {
				this.setHours(this.getHours() + 12);
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
					shc_cls = el_type.getAttribute("shc-cls");
					shc_cls = shc_cls
						? this.splitClass(shc_cls, 0)
						: "SHCalendar-hover-" + shc_type;
					if ("date" != shc_type || this.selection.type)
						this.changeCalss(io, el_type, shc_cls);
					if ("date" == shc_type) {
						this.changeCalss(
							io,
							el_type.parentNode.parentNode,
							"SHCalendar-hover-week"
						);
						this._showTooltip(el_type.getAttribute("shc-date"));
					}
					if (/^time-hour/.test(shc_type))
						this.changeCalss(io, this.els.timeHour, "SHCalendar-hover-time");
					if (/^time-min/.test(shc_type))
						this.changeCalss(io, this.els.timeMinute, "SHCalendar-hover-time");
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
						this.setHours(this.getHours() + wheelStep);
						break;
					case "time-min":
						this.setMinutes(
							this.getMinutes() + this.args.minuteStep * wheelStep
						);
				}
				this.stopEvent(event);
			} else {
				if (/Y/i.test(shc_btn)) wheelStep *= 2;
				this.changeDate(-wheelStep);
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
					this.changeDate(r);
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
						for (d = 100; d > 0; d--) {
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
		this.els.dayNames.innerHTML = this.Weeks();
		this.els.menu.innerHTML = this.Menu();
		if (this.els.bottomBar) this.els.bottomBar.innerHTML = this.BottomBar();
		this.setNode(this.els.topCont, (el: any) => {
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
		try {
			if (this._menuVisible) this.els.yearInput.focus();
			else this.els.focusLink.focus();
		} catch (err) {}
		this.onFocus();
	}

	onFocus() {
		//c
		if (this._bluringTimeout) clearTimeout(this._bluringTimeout);
		this.focused = true;
		this.addClass(this.els.main, "SHCalendar-focused");
		this.callHooks("onFocus");
	}

	blur() {
		this.els.focusLink.blur();
		this.els.yearInput.blur();
		this.onBlur();
	}

	onBlur() {
		//h
		this.focused = false;
		this.removeClass(this.els.main, "SHCalendar-focused");
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
		var evn = this.handlers[evname];
		for (let key in evn) {
			if (evn.hasOwnProperty(key)) {
				evn[key].apply(this, args);
			}
		}
	}

	getTime() {
		return this.date.getTime();
	}

	getHours() {
		return this.date.getHours();
	}

	getMinutes() {
		return this.date.getMinutes();
	}

	setHours(H24: number) {
		if (0 > H24) {
			H24 += 24;
		}
		//this.setTime(100 * (H % 24) + (this.time % 100));

		this.date.setHours(H24);
		if (this.args.showTime == 12) {
			if (0 == H24) {
				H24 = 12;
			}
			if (H24 > 12) {
				H24 -= 12;
			}
			this.els.timeAM.innerHTML = this.getLanguage(12 > H24 ? "AM" : "PM");
		}
		this.els.timeHour.innerHTML = H24.toString().padStart(2, "0");
	}

	setMinutes(minute: number) {
		if (0 > minute) minute += 60;
		minute = Math.floor(minute / this.args.minuteStep) * this.args.minuteStep;
		//this.setTime(100 * this.getHours() + (M % 60));
		this.date.setMinutes(minute);
		this.els.timeMinute.innerHTML = minute.toString().padStart(2, "0");
	}

	setTime(time: number | null, nohooks?: boolean) {
		//time, [ nohooks ]
		var input_field, selection, print;
		if (this.args.showTime) {
			time = null != time ? time : this.time;
			this.time = time;
			if (!nohooks) {
				this.callHooks("onTimeChange", time);
				input_field = this.args.inputField;
				selection = this.selection;
				if (input_field) {
					print = selection.print(this.args.dateFormat);
					if (/input|textarea/i.test(input_field.tagName)) {
						input_field.value = print;
					} else {
						input_field.innerHTML = print;
					}
				}
			}
		}
	}

	changeTime(shc_type: string) {
		// d()
		switch (shc_type) {
			case "time-hour+":
				this.setHours(this.getHours() + 1);
				break;
			case "time-hour-":
				this.setHours(this.getHours() - 1);
				break;
			case "time-min+":
				this.setMinutes(this.getMinutes() + this.args.minuteStep);
				break;
			case "time-min-":
				this.setMinutes(this.getMinutes() - this.args.minuteStep);
				break;
		}
		return;
	}

	static intToDate(
		date: SHDate | number | string,
		hours?: number,
		minute?: number,
		second?: number,
		milliSecond?: number
	): SHDate {
		//A()
		var year: number, month: number;

		if (date instanceof SHDate) return date;
		date = typeof date == "number" ? date : parseInt(date, 10);
		year = Math.floor(date / 1e4);
		date %= 1e4;
		month = Math.floor(date / 100);
		date %= 100; //day
		return new SHDate(year, month - 1, date, null == hours ? 12 : hours);
	}

	static dateToInt(date: SHDate | number | string): number {
		//L()
		if (date instanceof SHDate)
			return (
				date.getFullYear() * 1e4 + (date.getMonth() + 1) * 100 + date.getDate()
			);
		return typeof date == "string" ? parseInt(date, 10) : date;
	}

	_getInputYear() {
		var year = parseInt(this.els.yearInput.value, 10);
		if (typeof year !== "number") {
			year = this.date.getFullYear();
		}
		return year;
	}

	getAttributeType(event: any) {
		// get shc-type
		//var { target } = event;
		var target = event.target,
			temp_target = target;
		for (; target && target.getAttribute && !target.getAttribute("shc-type"); )
			target = target.parentNode;
		return (target.getAttribute && target) || temp_target;
	}

	getElementDate(shc_date: string | number | boolean): HTMLElement | false {
		var temp_el: HTMLElement | false = false;
		if (shc_date) {
			try {
				this.setNode(this.els.body, function (el: HTMLElement) {
					if (el.getAttribute("shc-date") == shc_date) throw (temp_el = el!);
				});
			} catch (el) {}
		}
		return temp_el;
	}

	Animation(args: any, e?: any, n?: any) {
		//animation

		args = this.mergeData(args, {
			fps: 50,
			len: 15,
			onUpdate: Function(),
			onStop: Function()
		});
		if (SHCalendar.IS_IE) args.len = Math.round(args.len / 2);

		const result = {
			map: function (t: number, e: number, n: number, a: number) {
				if (a) {
					return n + t * (e - n);
				} else {
					return e + t * (n - e);
				}
			},
			update: () => {
				var e = args.len;
				args.onUpdate(n / e, result.map);
				if (n == e) result.stop();
				++n;
			},
			start: () => {
				if (e) stop();
				n = 0;
				e = setInterval(result.update, 1e3 / args.fps);
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
		if ("" === value) {
			if (SHCalendar.IS_IE) el.style.filter = "";
			else el.style.opacity = "";
		} else if (null != value) {
			if (SHCalendar.IS_IE)
				el.style.filter = "alpha(opacity=" + 100 * value + ")";
			else el.style.opacity = value;
		} else if (SHCalendar.IS_IE) {
			if (/alpha\(opacity=([0-9.])+\)/.test(el.style.opacity))
				value = parseFloat(RegExp.$1) / 100;
			else value = parseFloat(el.style.opacity);
		}
		return value;
	}

	moveTo(date: SHDate | number | string, animation?: boolean | number) {
		//date , animation
		var a: any,
			datedif: any,
			args: any,
			min: any = false,
			max: any = false,
			body: HTMLElement,
			el: HTMLElement,
			firstChild: any,
			u: any,
			ddbool: any,
			fcoffsetTL: any,
			elstyle: any,
			boffsetHW: any,
			cloneNode: any,
			cnstyle: any;
		//   v,
		date = this.setDate(date);
		datedif = this.dateDiff(date, this.date, true);
		args = this.args;
		if (this.args.min) min = this.dateDiff(date, this.args.min);
		if (this.args.max) max = this.dateDiff(date, this.args.max);
		if (!args.animation) animation = false;
		this.changeCalss(
			false != min && 1 >= min,
			[this.els.navPrevMonth, this.els.navPrevYear],
			"SHCalendar-navDisabled"
		);
		this.changeCalss(
			false != max && max >= -1,
			[this.els.navNextMonth, this.els.navNextYear],
			"SHCalendar-navDisabled"
		);
		if (-1 > min) {
			date = args.min;
			a = 1;
			datedif = 0;
		}
		if (max > 1) {
			date = args.max;
			a = 2;
			datedif = 0;
		}
		this.date = SHCalendar.intToDate(date);
		this.refresh(!!animation);
		this.callHooks("onChange", date, animation);
		if (!(!animation || (0 == datedif && 2 == animation))) {
			this._bodyAnim && this._bodyAnim.stop();
			body = this.els.body;
			el = this.createElement(
				"div",
				"SHCalendar-animBody-" + this.#control_button[datedif],
				body
			);
			firstChild = body.firstChild;
			this.setOpacity(firstChild, 0.7);
			if (a) u = this.#math_animation.brakes;
			else if (0 == datedif) u = this.#math_animation.shake;
			else u = this.#math_animation.accel_ab2;
			ddbool = datedif * datedif > 4;
			fcoffsetTL = ddbool ? firstChild.offsetTop : firstChild.offsetLeft;
			elstyle = el.style;
			boffsetHW = ddbool ? body.offsetHeight : body.offsetWidth;
			if (0 > datedif) boffsetHW += fcoffsetTL;
			else if (datedif > 0) boffsetHW = fcoffsetTL - boffsetHW;
			else {
				boffsetHW = Math.round(boffsetHW / 7);
				2 == a && (boffsetHW = -boffsetHW);
			}
			if (!(a || 0 == datedif)) {
				cloneNode = el.cloneNode(true);
				cnstyle = cloneNode.style;
				//v = 2 * boffsetHW;
				cloneNode.appendChild(firstChild.cloneNode(true));
				cnstyle[ddbool ? "marginTop" : "marginLeft"] = boffsetHW + "px";
				body.appendChild(cloneNode);
			}
			firstChild.style.visibility = "hidden";
			el.innerHTML = this.Day();
			this._bodyAnim = this.Animation({
				onUpdate: function (t: number, e: Function) {
					var n,
						i = this.onBluringTimeout(t);
					cloneNode && (n = e(i, boffsetHW, 2 * boffsetHW) + "px"),
						a
							? (elstyle[ddbool ? "marginTop" : "marginLeft"] =
									e(i, boffsetHW, 0) + "px")
							: ((ddbool || 0 == datedif) &&
									((elstyle.marginTop =
										e(0 == datedif ? u(t * t) : i, 0, boffsetHW) + "px"),
									0 != datedif && (cnstyle.marginTop = n)),
							  (ddbool && 0 != datedif) ||
									((elstyle.marginLeft = e(i, 0, boffsetHW) + "px"),
									0 != datedif && (cnstyle.marginLeft = n))),
						this.args.opacity > 2 &&
							cloneNode &&
							(this.setOpacity(cloneNode, 1 - i), this.setOpacity(el, i));
				},
				onStop: function () {
					body.innerHTML = this.Day(date);
					this._bodyAnim = null;
				}
			});
		}
		this._lastHoverDate = false;
		return min >= -1 && 1 >= max;
	}

	isDisabled(date: SHDate) {
		var args = this.args;
		if (args.min) return this.dateDiff(date, args.min) < 0;
		else if (args.max) return this.dateDiff(date, args.max) > 0;
		else if (args.disabled) return args.disabled(date);
		return false;
	}

	toggleMenu() {
		this.showMenu(!this._menuVisible);
	}

	refresh(noBody?: boolean) {
		if (!noBody) this.els.body.innerHTML = this.Day();
		this.els.title.innerHTML = this.Title();
		if (this.els.yearInput) this.els.yearInput.value = this.date.getFullYear();
	}

	showMenu(visible: boolean) {
		// show menu
		var menu: any, offset_height: number;
		this._menuVisible = visible;
		this.changeCalss(visible, this.els.title, "SHCalendar-pressed-title");
		menu = this.els.menu;
		if (menu) {
			if (SHCalendar.IS_IE6)
				menu.style.height = this.els.main.offsetHeight + "px";
			if (this.args.animation) {
				if (this._menuAnim) this._menuAnim.stop();
				offset_height = this.els.main.offsetHeight;
				if (SHCalendar.IS_IE6)
					menu.style.width = this.els.topBar.offsetWidth + "px";
				if (visible) {
					menu.firstChild.style.marginTop = -offset_height + "px";
					if (this.args.opacity > 0) this.setOpacity(menu, 0);
					this.styleDisplay(menu, true);
				}
				this._menuAnim = this.Animation({
					onUpdate: function (s: number, i: Function) {
						menu.firstChild.style.marginTop =
							i(this.#math_animation.accel_b(s), -offset_height, 0, !visible) +
							"px";
						if (this.args.opacity > 0)
							this.setOpacity(
								menu,
								i(this.#math_animation.accel_b(s), 0, 0.85, !visible)
							);
					},
					onStop: function () {
						if (this.args.opacity > 0) this.setOpacity(menu, 0.85);
						menu.firstChild.style.marginTop = "";
						this._menuAnim = null;
						if (!visible) {
							this.styleDisplay(menu, false);
							if (this.focused) this.focus();
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
		// display
		if (is_display != null) el.style.display = is_display ? "" : "none";
		return el.style.display != "none";
	}

	removeClass(el: HTMLElement | false, old_class: any, new_class: any = 0) {
		// Y
		var temp_cls: any = [];
		if (el) {
			var i: number,
				cls: any[] = el.className.replace(/^\s+|\s+$/, " ").split(/\x20/);
			for (i = cls.length - 1; i > 0; i--)
				if (cls[i] != old_class) temp_cls.push(cls[i]);
			if (new_class) temp_cls.push(new_class);
			el.className = temp_cls.join(" ");
			// if (el.classList as DOMTokenList) {
			// 	console.log(el.classList);
			// }
		}
		return new_class;
	}

	addClass(el: HTMLElement | false, new_class: string) {
		// P
		return this.removeClass(el, new_class, new_class);
	}

	splitClass(string: string, index: number) {
		return "SHCalendar-" + string.split(/,/)[index];
	}

	changeCalss(
		is_change: boolean,
		el: HTMLElement | HTMLElement[],
		new_class: string
	) {
		// R
		if (el instanceof Array)
			for (var i = el.length - 1; i >= 0; i--)
				this.changeCalss(is_change, el[i], new_class);
		else this.removeClass(el, new_class, is_change ? new_class : false);
		return is_change;
	}

	dateDiff(first_date: SHDate, second_date: SHDate, is_day: boolean = true) {
		//H()
		var first_year: number = first_date.getFullYear(),
			first_month: number = first_date.getMonth(),
			first_day: number = is_day ? first_date.getDate() : 0,
			second_year: number = second_date.getFullYear(),
			second_month: number = second_date.getMonth(),
			second_day: number = is_day ? second_date.getDate() : 0;
		if (second_year > first_year) {
			return -3;
		} else if (first_year > second_year) {
			return 3;
		} else if (second_month > first_month) {
			return -2;
		} else if (first_month > second_month) {
			return 2;
		} else if (second_day > first_day) {
			return -1;
		} else if (first_day > second_day) {
			return 1;
		}
		return 0;
	}

	changeDate(shc_btn: any, anim?: any) {
		// f()
		if (this._bodyAnim) this._bodyAnim.stop();
		if (0 != shc_btn) {
			var date = this.date;
			date.setDate(1);
			switch (shc_btn) {
				case "-Y":
				case -2:
					date.setFullYear(date.getFullYear() - 1);
					break;
				case "+Y":
				case 2:
					date.setFullYear(date.getFullYear() + 1);
					break;
				case "-M":
				case -1:
					date.setMonth(date.getMonth() - 1);
					break;
				case "+M":
				case 1:
					date.setMonth(date.getMonth() + 1);
			}
		} else date = new SHDate();
		return this.moveTo(date, !anim);
	}

	hide() {
		this.callHooks("onClose", this);
		var top_cont = this.els.topCont,
			first_child = this.els.body.firstChild,
			offset_height = first_child.offsetHeight,
			pos_y = this.getAbsolutePos(top_cont).y;

		if (this.args.animation) {
			if (this._showAnim) this._showAnim.stop();
			this._showAnim = this.Animation({
				onUpdate: (i: number, r: Function) => {
					if (this.args.opacity > 1) this.setOpacity(top_cont, 1 - i);
					first_child.style.marginTop =
						-r(this.#math_animation.accel_b(i), 0, offset_height) + "px";
					top_cont.style.top =
						r(this.#math_animation.accel_ab(i), pos_y, pos_y - 10) + "px";
				},
				onStop: () => {
					top_cont.style.display = "none";
					first_child.style.marginTop = "";
					if (this.args.opacity > 1) this.setOpacity(top_cont, "");
					this._showAnim = null;
				}
			});
		} else top_cont.style.display = "none";
		this.input_field = null;
	}

	_showTooltip(full_date?: number) {
		var dateInfo,
			template: string = "",
			date: SHDate,
			tooltip = this.els.tooltip;
		if (full_date) {
			date = SHCalendar.intToDate(full_date);
			dateInfo = this.args.dateInfo(date);
			if (dateInfo && dateInfo.tooltip) {
				template =
					"<div class='SHCalendar-tooltipCont'>" +
					this.printDate(date, dateInfo.tooltip) +
					"</div>";
			}
		}
		tooltip && (tooltip.innerHTML = template);
	}

	printDate(date: SHDate = this.date, str: any): any {
		//S()
		var month = date.getMonth(),
			day = date.getDate(),
			year = date.getFullYear(),
			woy = this.getWeekNumber(date),
			dow = date.getDay(),
			hours = date.getHours(),
			h12 = hours >= 12 ? hours - 12 : hours || 12,
			doy = this.getDayOfYear(date),
			minutes = date.getMinutes(),
			second = date.getSeconds(),
			reg = /%./g;
		woy = woy instanceof Number ? woy.toString() : woy;
		var data: any = {
			"%a": this.getLanguage("sdn")[dow],
			"%A": this.getLanguage("dn")[dow],
			"%b": this.getLanguage("smn")[month],
			"%B": this.getLanguage("mn")[month],
			"%C": 1 + Math.floor(year / 100),
			"%d": 10 > day ? "0" + day : day,
			"%e": day,
			"%H": 10 > hours ? "0" + hours : hours,
			"%I": 10 > h12 ? "0" + h12 : h12,
			"%j": 10 > doy ? "00" + doy : 100 > doy ? "0" + doy : doy,
			"%k": hours,
			"%l": h12,
			"%m": 9 > month ? "0" + (1 + month) : 1 + month,
			"%o": 1 + month,
			"%M": 10 > minutes ? "0" + minutes : minutes,
			"%n": "\n",
			"%p": hours >= 12 ? "PM" : "AM",
			"%P": hours >= 12 ? "pm" : "am",
			"%s": Math.floor(date.getTime() / 1e3),
			"%S": 10 > second ? "0" + second : second,
			"%t": "	",
			"%U": 10 > woy ? "0" + woy : woy,
			"%W": 10 > woy ? "0" + woy : woy,
			"%V": 10 > woy ? "0" + woy : woy,
			"%u": dow + 1,
			"%w": dow,
			"%y": ("" + year).substr(2, 2),
			"%Y": year,
			"%%": "%"
		};
		return str.replace(reg, function (t: any) {
			return data.hasOwnProperty(t) ? data[t] : t;
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
			hours = parseInt(time[1], 10);
			minute = parseInt(time[2], 10);
			second = time[3] ? parseInt(time[3].substr(1), 10) : 0;
			str =
				str.substring(0, time.index) + str.substr(time.index + time[0].length);
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
				return is_unicode_letter(charAt()) ? s(t) : parseInt(t, 10);
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
				? ((year = parseInt(y, 10)),
				  null == month && null == day && null == n && (n = true))
				: /^[0-9]{1,2}$/.test(y)
				? ((y = parseInt(y, 10)),
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

	kcmonth(t: any) {
		//keyCodeMonth I
		const e = (e: any) => {
			for (var n = e.length; --n >= 0; )
				if (e[n].toLowerCase().indexOf(t) == 0) return n + 1;
		};
		return /\S/.test(t)
			? ((t = t.toLowerCase()),
			  e(this.getLanguage("smn")) || e(this.getLanguage("mn")))
			: void 0;
	}

	static isUnicodeLetter(str: any) {
		return str.toUpperCase() != str.toLowerCase();
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

	setLanguage(lang: any) {
		//this.#lang = Word.checkLanguage(lang);
		if (lang) {
			this.fdow = Word.getFirstDayOfWeek();
			this.redraw();
		}
	}

	getWeekNumber(date: SHDate) {
		return date.format("Woy")[0][1];
	}

	getDayOfYear(date: SHDate) {
		return date.format("Doy")[0];

		// var time, now: any, then: any;
		// now = new SHDate(
		// 	date.getFullYear(),
		// 	date.getMonth(),
		// 	date.getDate(),
		// 	12,
		// 	0,
		// 	0
		// );
		// then = new SHDate(date.getFullYear(), 0, 1, 12, 0, 0);
		// time = now - then;
		// return Math.floor(time / 864e5);
	}

	template() {
		//Calendar
		var template: string[] = [];
		template.push(
			"<table class='SHCalendar-topCont' align='center' cellspacing='0' cellpadding='0'><tr><td><div class='SHCalendar'>",
			SHCalendar.IS_IE
				? "<a class='SHCalendar-focusLink' href='#'></a>"
				: "<button class='SHCalendar-focusLink'></button>",
			"<div class='SHCalendar-topBar'><div shc-type='nav' shc-btn='-Y' shc-cls='hover-navBtn,pressed-navBtn' ",
			"class='SHCalendar-navBtn SHCalendar-prevYear'><div></div></div><div shc-type='nav' shc-btn='+Y' shc-cls='hover-navBtn,pressed-navBtn' ",
			"class='SHCalendar-navBtn SHCalendar-nextYear'><div></div></div><div shc-type='nav' shc-btn='-M' shc-cls='hover-navBtn,pressed-navBtn' ",
			"class='SHCalendar-navBtn SHCalendar-prevMonth'><div></div></div><div shc-type='nav' shc-btn='+M' shc-cls='hover-navBtn,pressed-navBtn' ",
			"class='SHCalendar-navBtn SHCalendar-nextMonth'><div></div></div><table class='SHCalendar-titleCont' align='center' cellspacing='0' cellpadding='0'><tr><td><div shc-type='title' shc-btn='menu' shc-cls='hover-title,pressed-title' class='SHCalendar-title'><div unselectable='on'>" +
				this.printDate(this.date, this.args.titleFormat) +
				"</div></div></td></tr></table><div class='SHCalendar-dayNames'>",
			this.Weeks(),
			"</div></div><div class='SHCalendar-body'></div>"
		);
		if (this.args.bottomBar || this.args.showTime)
			template.push(
				"<div class='SHCalendar-bottomBar'>",
				this.BottomBar(),
				"</div>"
			);
		template.push(
			"<div class='SHCalendar-menu' style='display: none'>",
			this.Menu(),
			"</div><div class='SHCalendar-tooltip'></div></div></td></tr></table>"
		);
		return template.join("");
	}

	Menu() {
		//i()
		var col: number, month: number, month_short_name: string;
		var template: string[] = [];
		template.push(
			"<table height='100%'",
			" align='center' cellspacing='0' cellpadding='0'",
			"><tr><td><table style='margin-top: 1.5em'",
			" align='center' cellspacing='0' cellpadding='0'",
			">",
			"<tr><td colspan='3'><input shc-btn='year' class='SHCalendar-menu-year' size='6' value='",
			this.date.getFullYear().toString(),
			"' /></td><td><div shc-type='menubtn' shc-cls='hover-navBtn,pressed-navBtn' shc-btn='today'>",
			this.date.getFullYear().toString(),
			"</div></td></tr><tr><td><div shc-type='menubtn' shc-cls='hover-navBtn,pressed-navBtn' shc-btn='today'>",
			this.getLanguage("goToday"),
			"</div></td></tr></table><p class='SHCalendar-menu-sep'>&nbsp;</p><table class='SHCalendar-menu-mtable'",
			" align='center' cellspacing='0' cellpadding='0'",
			">"
		);
		month_short_name = this.getLanguage("smn");
		for (month = 0; 12 > month; month++) {
			template.push("<tr>");
			for (col = 5 - 1; col > 0; col--)
				template.push(
					"<td><div shc-type='menubtn' shc-cls='hover-navBtn,pressed-navBtn' shc-btn='m" +
						month.toString() +
						"' class='SHCalendar-menu-month'>" +
						month_short_name[month] +
						"</div></td>"
				);
			template.push("</tr>");
		}
		template.push("</table></td></tr></table>");
		return template.join("");
	}

	Weeks() {
		//Calendar-weekNumber
		var template: string[] = [];
		var day: number = 0,
			weekend: number | number[] = this.getLanguage("weekend");
		weekend = weekend instanceof Array ? weekend : [weekend];
		template.push("<table align='center' cellspacing='0' cellpadding='0'><tr>");
		if (this.args.weekNumbers)
			template.push(
				"<td><div class='SHCalendar-weekNumber'>",
				this.getLanguage("wk"),
				"</div></td>"
			);
		for (var col = 0; 7 > col; col++) {
			day = (col + this.fdow) % 7;
			template.push(
				"<td><div",
				weekend.indexOf(day) < 0 ? ">" : " class='SHCalendar-weekend'>",
				this.getLanguage("sdn")[day],
				"</div></td>"
			);
		}
		template.push("</tr></table>");
		return template.join("");
	}

	Day(date: SHDate = this.date, fdow: number = this.fdow) {
		//Calendar-day
		var template: string[] = [],
			fulldate: number,
			year: number,
			month: number,
			day: number,
			date_today: SHDate,
			fulldate_today: number,
			year_today: number,
			month_today: number,
			day_today: number,
			month_view: number,
			weekend: number | number[] = this.getLanguage("weekend"),
			horizontal: number,
			vertical: number,
			is_wk: boolean,
			is_selected: boolean,
			is_disabled: boolean,
			date_info: any;
		weekend = weekend instanceof Array ? weekend : [weekend];
		date = new SHDate(date.getFullYear(), date.getMonth(), date.getDate(), 12);
		month_view = date.getMonth();
		is_wk = this.args.weekNumbers;
		date.setDate(1);
		date.setDate(-date.getDay() + 1);
		date_today = new SHDate();
		year_today = date_today.getFullYear();
		month_today = date_today.getMonth();
		day_today = date_today.getDate();
		fulldate_today = 1e4 * year_today + 100 * (month_today + 1) + day_today;
		//this._lastHoverDate = fulldate_today;
		template.push(
			"<table class='SHCalendar-bodyTable'" +
				" align='center' cellspacing='0' cellpadding='0'" +
				">"
		);
		for (horizontal = 0; horizontal < 6; horizontal++) {
			template.push("<tr class='SHCalendar-week");
			if (0 == horizontal) template.push(" SHCalendar-first-row");
			if (5 == horizontal) template.push(" SHCalendar-last-row");
			template.push("'>");
			if (is_wk)
				template.push(
					"<td class='SHCalendar-first-col'><div class='SHCalendar-weekNumber'>" +
						this.getWeekNumber(date) +
						"</div></td>"
				);
			for (vertical = 0; vertical < 7; vertical++, date.setDate(day + 1)) {
				day = date.getDate();
				month = date.getMonth();
				year = date.getFullYear();
				fulldate = 1e4 * year + 100 * (month + 1) + day; //14010212
				template.push("<td class='");
				if (0 == vertical && !is_wk) {
					template.push(" SHCalendar-first-col");
					if (0 == horizontal) {
						this._firstDateVisible = fulldate;
					}
				}
				if (6 == vertical) {
					template.push(" SHCalendar-last-col");
					if (5 == horizontal) this._lastDateVisible = fulldate;
				}
				is_selected = this.selection.isSelected(fulldate);
				if (is_selected) template.push(" SHCalendar-td-selected");
				template.push(
					`'><div shc-type='date' unselectable='on' shc-date='${fulldate.toString()}'`
				);
				is_disabled = this.isDisabled(date);
				if (is_disabled) template.push("disabled='1' ");
				template.push("class='SHCalendar-day");
				if (!(weekend.indexOf(date.getDay()) < 0))
					template.push(" SHCalendar-weekend");
				if (month != month_view) template.push(" SHCalendar-day-othermonth");
				if (fulldate === fulldate_today) template.push(" SHCalendar-day-today");
				if (is_disabled) template.push(" SHCalendar-day-disabled");
				if (is_selected) template.push(" SHCalendar-day-selected");
				date_info = this.args.dateInfo(date);
				if (is_disabled && date_info.klass)
					template.push(" " + date_info.klass);
				template.push("'>" + day + "</div></td>");
			}
			template.push("</tr>");
		}
		template.push("</table>");
		return template.join("");
	}

	Time() {
		//print Calendar-time
		var template: string[] = [];
		template.push(
			"<table class='SHCalendar-time'" +
				" align='center' cellspacing='0' cellpadding='0'" +
				"><tr><td rowspan='2'><div shc-type='time-hour' shc-cls='hover-time,pressed-time' class='SHCalendar-time-hour'></div></td><td shc-type='time-hour+' shc-cls='hover-time,pressed-time' class='SHCalendar-time-up'></td><td rowspan='2' class='SHCalendar-time-sep'></td><td rowspan='2'><div shc-type='time-min' shc-cls='hover-time,pressed-time' class='SHCalendar-time-minute'></div></td><td shc-type='time-min+' shc-cls='hover-time,pressed-time' class='SHCalendar-time-up'></td>"
		),
			this.args.showTime == 12 &&
				template.push(
					"<td rowspan='2' class='SHCalendar-time-sep'></td><td rowspan='2'><div class='SHCalendar-time-am' shc-type='time-am' shc-cls='hover-time,pressed-time'></div></td>"
				),
			template.push(
				"</tr><tr><td shc-type='time-hour-' shc-cls='hover-time,pressed-time' class='SHCalendar-time-down'></td><td shc-type='time-min-' shc-cls='hover-time,pressed-time' class='SHCalendar-time-down'></td></tr></table>"
			);
		return template.join("");
	}

	Title() {
		//Title
		return (
			"<div unselectable='on'>" +
			this.printDate(this.date, this.args.titleFormat) +
			"</div>"
		);
	}

	BottomBar() {
		// o
		var template: string[] = [];
		template.push(
			"<table",
			"align='center' cellspacing='0' cellpadding='0'",
			" style='width:100%'><tr>"
		);
		if (this.args.showTime && this.args.timePos == "left")
			template.push("<td>", this.Time(), "</td>");
		if (this.args.bottomBar) {
			template.push(
				"<td><table align='center' cellspacing='0' cellpadding='0'><tr><td><div shc-btn='today' shc-cls='hover-bottomBar-today,pressed-bottomBar-today' shc-type='bottomBar-today' class='SHCalendar-bottomBar-today'>",
				this.getLanguage("today"),
				"</div></td></tr></table></td>"
			);
		}
		if (this.args.showTime && this.args.timePos == "right")
			template.push("<td>", this.Time(), "</td>");
		template.push("</tr></table>");
		return template.join("");
	}

	getVersion() {
		return SHCalendar.VERSION;
	}

	inputField() {
		// C
		var field, sel, print;
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
				this._showAnim = this.Animation({
					onUpdate: function (t: any, e: any) {
						first_child.style.marginTop =
							-e(this.#math_animation.accel_b(t), offsetHeight, 0) + "px";
						if (this.args.opacity > 1) this.setOpacity(top_cont, t);
					},
					onStop: function () {
						if (this.args.opacity > 1) this.setOpacity(top_cont, "");
						this._showAnim = null;
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
