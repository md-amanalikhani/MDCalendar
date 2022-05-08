/**
 * In the name of Allah, the Beneficent, the Merciful.
 * @package The Calendar Related Extensions - SH (Solar Hijri, Shamsi Hijri, Iranian Hijri)
 * @author   Mohammad Amanalikhani
 * @link    http://docs.akhi.ir/js/SHCalendar
 * @copyright   Copyright (C) 2015 - 2022 . All right reserved.
 * @license https://www.gnu.org/licenses/agpl-3.0.en.html AGPL-3.0 License
 * @version Release: 1.0.0
 */
import Word from "./word.js";
import Selection from "./selection.js";
import SHDate from "@md-akhi/shdatetime";

export default class SHCalendar {
	static version: string = "1.0.0";
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

	static SEL_NONE = 0;
	static SEL_SINGLE = 1;
	static SEL_MULTIPLE = 2;
	static SEL_WEEK = 3;

	static defaultArgs = {
		cont: null,
		bottomBar: true,
		titleFormat: "%b %Y",
		dateFormat: "%Y-%m-%d",
		date: true,
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
		selectionType: SHCalendar.SEL_MULTIPLE,
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
	_firstDateVisible: number | false = false;
	_lastDateVisible: number | false = false;
	_lastHoverDate: number | false = false;
	_showAnim: any;
	dateFormat: any;
	input_field: any;
	#lang: string = SHCalendar.defaultArgs.lang;

	constructor(args: any = SHCalendar.defaultArgs) {
		var date: SHDate = new SHDate();
		this.args = args = this.setArgs(args, SHCalendar.defaultArgs);
		this.handlers = {};
		this.args.min = this.setDate(args.min);
		this.args.max = this.setDate(args.max);
		this.date = new SHDate();
		if (args.time === true)
			this.time =
				date.getHours() * 100 +
				Math.floor(date.getMinutes() / args.minuteStep) * args.minuteStep;
		this.fdow = args.fdow;
		this.setFunction(
			"onChange onSelect onTimeChange onFocus onBlur onClose".split(/\s+/),
			(evname: string) => {
				const evn = args[evname];
				this.handlers[evname] = evn instanceof Array ? evn : [evn];
			}
		);
		this.selection = new Selection(
			args.selection,
			args.selectionType,
			this.inputField,
			this
		);

		this.init();
		//args.trigger && this.manageFields(args.trigger,args.inputField, args.dateFormat),//popup
	}

	setArgs(args: any, defaultArgs: any): any {
		//E()
		return { ...defaultArgs, ...args };
		// let arg,
		// 	newArgs = {};
		// for (arg in SHCalendar.defaultArgs)
		// 	if (SHCalendar.defaultArgs.hasOwnProperty(arg))
		// 		newArgs[arg] = args[arg] || SHCalendar.defaultArgs[arg];
		// return newArgs;
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

	setFunction(event: string[], callback: Function) {
		//q()
		for (const key in event) callback(event[key]);
	}

	init(): HTMLElement {
		var els: any;
		var el = this.getElementById(this.args.cont);
		els = this.els = {};
		const event: any = {
			mousedown: (event: MouseEvent) => this.mouseClick(true, event),
			mouseup: (event: MouseEvent) => this.mouseClick(false, event),
			mouseover: (event: MouseEvent) => this.mouseHover(true, event),
			mouseout: (event: MouseEvent) => this.mouseHover(false, event)
			// keypress: (event: KeyboardEvent) => this.keypress(event)
		};
		const event_IE: any = SHCalendar.IS_IE
			? {
					// dblclick: event.mousedown,
					// keydown: event.keypress
			  }
			: {};

		const event_wheel: any = !this.args.noScroll
			? SHCalendar.IS_GECKO
				? {
						// DOMMouseScroll: (event: WheelEvent) => this.wheelCHTime(event)
				  }
				: {
						// mousewheel: (event: WheelEvent) => this.wheelCHTime(event)
				  }
			: {};
		el.innerHTML = this.template();
		this.setNode(el.firstChild, (el: any) => {
			var class_name = this.#top_class[el.className];
			if (class_name) els[class_name] = el;
			if (SHCalendar.IS_IE) el.setAttribute("unselectable", "on");
		});
		this.addEvent(els.main, event); //, ...event_IE, ...event_wheel
		this._focusEvents = {
			focus: () => this.onFocus(),
			blur: () => this.onBluringTimeout()
		};
		this.addEvent([els.focusLink, els.yearInput], this._focusEvents);

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

	addEvent(el: any, evname: any, callback?: any, a?: any) {
		//addEvent = function(el, evname, func) {
		var i: any;
		if (el instanceof Array)
			for (i = el.length - 1; i >= 0; i--)
				this.addEvent(el[i], evname, callback, a);
		else if ("object" == typeof evname)
			for (i in evname)
				if (evname.hasOwnProperty(i)) this.addEvent(el, i, evname[i], callback);

		if (el)
			if (el.addEventListener)
				el.addEventListener(evname, callback, SHCalendar.IS_IE ? true : !!a);
			else if (el.attachEvent) el.attachEvent("on" + evname, callback);
			else el["on" + evname] = callback;
	}

	stopEvent(event: MouseEvent) {
		//stopEvent   N
		if (SHCalendar.IS_IE) {
			event.cancelBubble = true;
			event.returnValue = false;
		} else {
			event.preventDefault();
			event.stopPropagation();
		}
		return false;
	}

	removeEvent(el: any, evname: any, callback?: any, a?: any) {
		//removeEvent   F
		var i: number | string;
		if (el instanceof Array)
			for (i = el.length - 1; i >= 0; i--)
				this.removeEvent(el[i], evname, callback, a);
		else if ("object" == typeof evname)
			for (i in evname)
				if (evname.hasOwnProperty(i))
					this.removeEvent(el, i, evname[i], callback);
		if (el)
			if (el.removeEventListener)
				el.removeEventListener(evname, callback, SHCalendar.IS_IE ? true : !!a);
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
			events = {
				mouseover: (event: MouseEvent) => this.stopEvent(event),
				mousemove: (event: MouseEvent) => this.stopEvent(event),
				mouseup: (event?: MouseEvent) => {
					var shc_cls = el_type.getAttribute("shc-cls");
					if (shc_cls) this.removeClass(el_type, this.splitClass(shc_cls, 1));
					clearTimeout(timeOut);
					this.removeEvent(document, events, true);
					//events = null;
				}
			};
			if (io) {
				setTimeout(() => this.focus(), 1);
				shc_cls = el_type.getAttribute("shc-cls");
				if (shc_cls) this.addClass(el_type, this.splitClass(shc_cls, 1));
				if ("menu" == shc_btn) {
					this.toggleMenu();
				} else if (el_type && /^[+-][MY]$/.test(shc_btn)) {
					if (this.changeDate(shc_btn)) {
						u = () => {
							this.changeDate(shc_btn, true)
								? (timeOut = setTimeout(u, 40))
								: (events.mouseup(), this.changeDate(shc_btn));
						};
						timeOut = setTimeout(u, 350);
						this.addEvent(document, events, true);
					} else events.mouseup();
				} else if ("year" == shc_btn) {
					this.els.yearInput.focus();
					this.els.yearInput.select();
				} else if ("time-am" == shc_type) {
					this.addEvent(document, events, true);
				} else if (/^time/.test(shc_type)) {
					u = (t: string) => {
						this.changeTime(t);
						timeOut = setTimeout(u(shc_type), 100);
					};
					this.changeTime(shc_type);
					timeOut = setTimeout(u(shc_type), 350);
					this.addEvent(document, events, true);
				} else if (shc_date && selection.type) {
					if (selection.type == SHCalendar.SEL_MULTIPLE) {
						if (event.shiftKey && this._selRangeStart) {
							selection.selectRange(this._selRangeStart, shc_date);
						} else if (
							event.ctrlKey ||
							selection.isSelected(shc_date) ||
							!this.args.multiCtrl
						) {
							selection.clear(true),
								selection.set(shc_date, true),
								(this._selRangeStart = shc_date);
						}
					} else {
						selection.set(shc_date),
							this.moveTo(SHCalendar.intToDate(shc_date), 2);
					}
					console.log(shc_date);
					el_date = this.getElementDate(shc_date);
					this.mouseHover(true, { target: el_date });
					this.addEvent(document, events, true);
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
					this.addEvent(document, events, true);
				}
			} else if ("today" == shc_btn) {
				if (!(this._menuVisible || selection.type != SHCalendar.SEL_SINGLE))
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
				SHCalendar.IS_IE || this.stopEvent(event);
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
			keyCode,
			charCode,
			r,
			date,
			yearInput,
			selection,
			MN,
			monthName,
			d,
			m,
			p;
		if (!this._menuAnim) {
			event = event || window.event;
			target = event.target || event.srcElement;
			shc_btn = target.getAttribute("shc-btn");
			keyCode = event.keyCode;
			charCode = event.charCode || keyCode;
			r = this.#control_key[keyCode];
			if ("year" == shc_btn && 13 == keyCode) {
				date = new SHDate(this.date);
				date.setDate(1);
				date.setFullYear(this._getInputYear());
				this.moveTo(date, true);
				this.showMenu(false);
				return this.stopEvent(event);
			}
			if (this._menuVisible) {
				if (27 == keyCode) {
					this.showMenu(false);
					return this.stopEvent(event);
				}
			} else {
				if (!event.ctrlKey) r = null;
				if (null != r || !event.ctrlKey) r = this.#ne[keyCode];
				if (36 == keyCode) r = 0;
				if (null != r) {
					this.changeDate(r);
					return this.stopEvent(event);
				}
				charCode = String.fromCharCode(charCode).toLowerCase();
				yearInput = this.els.yearInput;
				selection = this.selection;
				if (" " == charCode) {
					this.showMenu(true);
					this.focus();
					yearInput.focus();
					yearInput.select();
					return this.stopEvent(event);
				}
				if (charCode >= "0" && "9" >= charCode) {
					this.showMenu(true);
					this.focus();
					yearInput.value = charCode;
					yearInput.focus();
					return this.stopEvent(event);
				}
				monthName = this.getLanguage("mn");
				d = event.shiftKey ? -1 : this.date.getMonth();
				for (m = 0; ++m < 12; ) {
					MN = monthName[(d + m) % 12].toLowerCase();
					if (MN.indexOf(charCode) == 0) {
						date = new SHDate(this.date);
						date.setDate(1);
						date.setMonth((d + m) % 12);
						this.moveTo(date, true);
						return this.stopEvent(event);
					}
				}
				if (keyCode >= 37 && 40 >= keyCode) {
					date = this._lastHoverDate;
					if (!(date || selection.isEmpty())) {
						date =
							39 > keyCode ? selection.getFirstDate() : selection.getLastDate();
						if (date < this._firstDateVisible || date > this._lastDateVisible)
							date = null;
					}
					if (date) {
						p = date;
						date = SHCalendar.intToDate(date);
						for (d = 100; d > 0; d--) {
							switch (keyCode) {
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
						date = SHCalendar.dateToInt(date);
						if (date < this._firstDateVisible || date > this._lastDateVisible)
							this.moveTo(date);
					} else
						date =
							39 > keyCode ? this._lastDateVisible : this._firstDateVisible;
					// this.removeClass(
					// 	this.getElementDate(p),
					// 	this.addClass(this.getElementDate(date), "SHCalendar-hover-date")
					// );
					this._lastHoverDate = date;
					return this.stopEvent(event);
				}
				if (13 == keyCode && this._lastHoverDate) {
					selection.type == SHCalendar.SEL_MULTIPLE &&
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
				27 != keyCode || this.args.cont || this.hide();
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
		}),
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
		this._bluringTimeout = setTimeout(this.onBlur, 50);
	}

	callHooks(evname: string, ...args: any[]) {
		var evn = this.handlers[evname];
		for (var i = 0; i < evn.length; ++i) evn[i](args); // evn[i].apply(this, args);
	}

	getTime() {
		//return this.time;
		return this.date.getTime();
	}

	getHours() {
		//return Math.floor(this.time / 100);
		return this.date.getHours();
	}

	getMinutes() {
		//return this.time % 100;
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
		0 > minute && (minute += 60);
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
		return new SHDate(
			year,
			month - 1,
			date,
			null == hours ? 12 : hours,
			null == minute ? 0 : minute,
			null == second ? 0 : second,
			null == milliSecond ? 0 : milliSecond
		);
	}

	static dateToInt(date: number | string | SHDate): number {
		//L()
		if (date instanceof SHDate)
			return (
				date.getFullYear() * 1e4 + (date.getMonth() + 1) * 100 + date.getDate()
			);
		return typeof date == "string" ? parseInt(date, 10) : date;
	}

	_getInputYear() {
		var year = parseInt(this.els.yearInput.value, 10);
		if (isNaN(year)) {
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

	getElementDate(shc_date: string | number): HTMLElement | null {
		var temp_el: HTMLElement | null = null;
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

		args = this.setArgs(args, {
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
			min: number | false = false,
			max: number | false = false,
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
		/*  v, */
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
		var menu: any, offsetHeight: number;
		this._menuVisible = visible;
		this.changeCalss(visible, this.els.title, "SHCalendar-pressed-title");
		menu = this.els.menu;
		if (SHCalendar.IS_IE6)
			menu.style.height = this.els.main.offsetHeight + "px";
		if (this.args.animation) {
			this._menuAnim && this._menuAnim.stop();
			offsetHeight = this.els.main.offsetHeight;
			if (SHCalendar.IS_IE6)
				menu.style.width = this.els.topBar.offsetWidth + "px";
			if (visible) {
				menu.firstChild.style.marginTop = -offsetHeight + "px";
				this.args.opacity > 0 && this.setOpacity(menu, 0);
				this.styleDisplay(menu, true);
			}
			this._menuAnim = this.Animation({
				onUpdate: function (s: number, i: Function) {
					menu.firstChild.style.marginTop =
						i(this.#math_animation.accel_b(s), -offsetHeight, 0, !visible) +
						"px";
					this.args.opacity > 0 &&
						this.setOpacity(
							menu,
							i(this.#math_animation.accel_b(s), 0, 0.85, !visible)
						);
				},
				onStop: function () {
					this.args.opacity > 0 && this.setOpacity(menu, 0.85);
					menu.firstChild.style.marginTop = "";
					this._menuAnim = null;
					if (!visible) {
						this.styleDisplay(menu, false);
						this.focused && this.focus();
					}
				}
			});
		} else {
			this.styleDisplay(menu, visible);
			this.focused && this.focus();
		}
	}

	styleDisplay(el: HTMLElement, is_display: boolean): boolean {
		// display
		if (is_display != null) el.style.display = is_display ? "" : "none";
		return el.style.display != "none";
	}

	removeClass(
		el: HTMLElement | null,
		old_class?: string,
		new_class?: string | null
	) {
		// Y
		if (el) {
			var i: number,
				cls: string[] = el.className.replace(/^\s+|\s+$/, "").split(/\x20/),
				temp_cls = [];
			for (i = cls.length; i > 0; )
				if (cls[--i] != old_class) temp_cls.push(cls[i]);
			if (new_class) temp_cls.push(new_class);
			el.className = temp_cls.join(" ");
		}
		return new_class;
	}

	addClass(el: HTMLElement, new_class: string) {
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
		else this.removeClass(el, new_class, is_change ? new_class : null);
		return is_change;
	}

	dateDiff(
		first_date: SHDate,
		second_date: SHDate,
		year_and_month: boolean = false
	) {
		//H()
		var first_year: number = first_date.getFullYear(),
			first_month: number = first_date.getMonth(),
			first_day: number = year_and_month ? 0 : first_date.getDate(),
			second_year: number = second_date.getFullYear(),
			second_month: number = second_date.getMonth(),
			second_day: number = year_and_month ? 0 : second_date.getDate();
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
		this._bodyAnim && this._bodyAnim.stop();
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
		var topCont = this.els.topCont,
			firstChild = this.els.body.firstChild,
			offsetHeight = firstChild.offsetHeight,
			s = this.getAbsolutePos(topCont).y;

		if (this.args.animation) {
			if (this._showAnim) this._showAnim.stop();
			this._showAnim = this.Animation({
				onUpdate: (i: number, r: Function) => {
					if (this.args.opacity > 1) this.setOpacity(topCont, 1 - i);
					(firstChild.style.marginTop =
						-r(this.#math_animation.accel_b(i), 0, offsetHeight) + "px"),
						(topCont.style.top =
							r(this.#math_animation.accel_ab(i), s, s - 10) + "px");
				},
				onStop: () => {
					(topCont.style.display = "none"), (firstChild.style.marginTop = "");
					if (this.args.opacity > 1) this.setOpacity(topCont, "");
					this._showAnim = null;
				}
			});
		} else topCont.style.display = "none";
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

	printDate(date: SHDate = this.date, str: string) {
		//S()
		var m = date.getMonth(),
			d = date.getDate(),
			y = date.getFullYear(),
			woy = this.getWeekNumber(date)[0],
			dow = date.getDay(),
			h = date.getHours(),
			h12 = h >= 12 ? h - 12 : h || 12,
			doy = this.getDayOfYear(date),
			i = date.getMinutes(),
			s = date.getSeconds(),
			reg = /%./g;
		woy = woy instanceof Number ? woy.toString() : woy;
		var data: any = {
			"%a": this.getLanguage("sdn")[dow],
			"%A": this.getLanguage("dn")[dow],
			"%b": this.getLanguage("smn")[m],
			"%B": this.getLanguage("mn")[m],
			"%C": 1 + Math.floor(y / 100),
			"%d": 10 > d ? "0" + d : d,
			"%e": d,
			"%H": 10 > h ? "0" + h : h,
			"%I": 10 > h12 ? "0" + h12 : h12,
			"%j": 10 > doy ? "00" + doy : 100 > doy ? "0" + doy : doy,
			"%k": h,
			"%l": h12,
			"%m": 9 > m ? "0" + (1 + m) : 1 + m,
			"%o": 1 + m,
			"%M": 10 > i ? "0" + i : i,
			"%n": "\n",
			"%p": h >= 12 ? "PM" : "AM",
			"%P": h >= 12 ? "pm" : "am",
			"%s": Math.floor(date.getTime() / 1e3),
			"%S": 10 > s ? "0" + s : s,
			"%t": "	",
			"%U": 10 > woy ? "0" + woy : woy,
			"%W": 10 > woy ? "0" + woy : woy,
			"%V": 10 > woy ? "0" + woy : woy,
			"%u": dow + 1,
			"%w": dow,
			"%y": ("" + y).substr(2, 2),
			"%Y": y,
			"%%": "%"
		};
		return str.replace(reg, function (t: any) {
			return data.hasOwnProperty(t) ? data[t] : t;
		});
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
		return date.format("woy");
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
		var k, month, shortMN;
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
		shortMN = this.getLanguage("smn");
		for (month = 0; 12 > month; ) {
			template.push("<tr>");
			for (k = 5; --k > 0; )
				template.push(
					"<td><div shc-type='menubtn' shc-cls='hover-navBtn,pressed-navBtn' shc-btn='m" +
						month.toString() +
						"' class='SHCalendar-menu-month'>" +
						shortMN[month++] +
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
		for (var a = 0; 7 > a; a++) {
			day = (a + this.fdow) % 7;
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
						this.getWeekNumber(date)[0] +
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
		return SHCalendar.version;
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

	popupForField(trigger: any, field: any, dateFormat: any) {
		var s: any, i: any, r: any, o: any;
		field = this.getElementById(field);
		trigger = this.getElementById(trigger);
		this.input_field = field;
		this.dateFormat = dateFormat;
		if (this.selection.type == SHCalendar.SEL_SINGLE) {
			s = /input|textarea/i.test(field.tagName)
				? field.value
				: field.innerText || field.textContent;
			if (s) {
				(i = /(^|[^%])%[bBmo]/.exec(dateFormat)),
					(r = /(^|[^%])%[de]/.exec(dateFormat));
				if (i && r) (o = i.index < r.index), (s = SHCalendar.parseDate(s, o));
				if (s) {
					this.selection.set(s, false, true);
					if (this.args.showTime) {
						this.setHours(s.getHours()), this.setMinutes(s.getMinutes());
					}
					this.moveTo(s);
				}
			}
		}
		this.popup(trigger);
	}

	manageFields(trigger: any, field: any, dateFormat: any) {
		field = this.getElementById(field);
		trigger = this.getElementById(trigger);
		if (/^button$/i.test(trigger.tagName))
			trigger.setAttribute("type", "button");
		this.addEvent(trigger, "click", (s: any) => {
			this.popupForField(trigger, field, dateFormat);
			return this.stopEvent(s);
		});
	}

	static parseDate(e: any, n: any, a?: any) {
		var s: any,
			i: any,
			r: any,
			o: any,
			l: any,
			c: any,
			h: any,
			u: any,
			d: any,
			f: any,
			y: any;
		if (!/\S/.test(e)) return "";
		(e = e.replace(/^\s+/, "").replace(/\s+$/, "")),
			(a = a || new SHDate()),
			(s = null),
			(i = null),
			(r = null),
			(o = null),
			(l = null),
			(c = null),
			(h = e.match(/([0-9]{1,2}):([0-9]{1,2})(:[0-9]{1,2})?\s*(am|pm)?/i)),
			h &&
				((o = parseInt(h[1], 10)),
				(l = parseInt(h[2], 10)),
				(c = h[3] ? parseInt(h[3].substr(1), 10) : 0),
				(e = e.substring(0, h.index) + e.substr(h.index + h[0].length)),
				h[4] &&
					(h[4].toLowerCase() == "pm" && 12 > o
						? (o += 12)
						: h[4].toLowerCase() != "am" || 12 > o || (o -= 12)));
	}

	popup(trigger: any, align?: any) {
		const alignment = (align: any) => {
			var pos: any = { x: l.x, y: l.y };
			if (align) {
				// vertical alignment
				if (/B/.test(align)) pos.y += trigger.offsetHeight;
				if (/b/.test(align)) pos.y += trigger.offsetHeight - tcpos.y;
				if (/T/.test(align)) pos.y -= tcpos.y;
				if (/m/i.test(align)) pos.y += (trigger.offsetHeight - tcpos.y) / 2;
				// horizontal alignment
				if (/l/.test(align)) pos.x -= tcpos.x - trigger.offsetWidth;
				if (/L/.test(align)) pos.x -= tcpos.x;
				if (/R/.test(align)) pos.x += trigger.offsetWidth;
				if (/c/i.test(align)) pos.x += (trigger.offsetWidth - tcpos.x) / 2;
				return pos;
			} else return pos;
		};
		var tcpos: any,
			postrigger: any,
			topCont: any,
			tcstyle: any,
			poscrol: any,
			l: any;
		this.showAt(0, 0);
		topCont = this.els.topCont;
		tcstyle = topCont.style;
		tcstyle.visibility = "hidden";
		tcstyle.display = "";
		document.body.appendChild(topCont);
		tcpos = {
			x: topCont.offsetWidth,
			y: topCont.offsetHeight
		};
		trigger = this.getElementById(trigger);
		postrigger = this.getAbsolutePos(trigger);
		l = postrigger;
		if (!align) align = this.args.align;
		(align = align.split(/\x2f/)),
			(l = alignment(align[0])),
			(poscrol = this.posScrol());
		if (l.y < poscrol.y) {
			(l.y = postrigger.y), (l = alignment(align[1]));
		}
		if (l.x + tcpos.x > poscrol.x + poscrol.w) {
			(l.x = postrigger.x), (l = alignment(align[2]));
		}
		if (l.y + tcpos.y > poscrol.y + poscrol.h) {
			(l.y = postrigger.y), (l = alignment(align[3]));
		}
		if (l.x < poscrol.x) {
			(l.x = postrigger.x), (l = alignment(align[4]));
		}
		this.showAt(l.x, l.y, true), (tcstyle.visibility = ""), this.focus();
	}

	showAt(lpos: any, tpos: any, banim?: any) {
		if (this._showAnim) this._showAnim.stop();
		banim = banim && this.args.animation;
		var topCont = this.els.topCont,
			firstChild = this.els.body.firstChild,
			offsetHeight = firstChild.offsetHeight,
			tcstyle = topCont.style,
			tis = this;
		tcstyle.position = "absolute";
		tcstyle.left = lpos + "px";
		tcstyle.top = tpos + "px";
		tcstyle.zIndex = 1e4;
		tcstyle.display = "";
		if (banim) {
			firstChild.style.marginTop = -offsetHeight + "px";
			if (this.args.opacity > 1)
				this.setOpacity(topCont, 0),
					(this._showAnim = this.Animation({
						onUpdate: function (t: any, e: any) {
							(firstChild.style.marginTop =
								-e(this.#math_animation.accel_b(t), offsetHeight, 0) + "px"),
								tis.args.opacity > 1 && this.setOpacity(topCont, t);
						},
						onStop: function () {
							tis.args.opacity > 1 && this.setOpacity(topCont, ""),
								(tis._showAnim = null);
						}
					}));
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
		event = event || window.event;
		var style = this.els.topCont.style,
			pos = this.position(event, this._mouseDiff);
		(style.left = pos.x + "px"), (style.top = pos.y + "px");
	}

	posScrol() {
		//X
		var docel = document.documentElement,
			docbody = document.body;
		return {
			x: docel.scrollLeft || docbody.scrollLeft,
			y: docel.scrollTop || docbody.scrollTop,
			w: docel.clientWidth || window.innerWidth || docbody.clientWidth,
			h: docel.clientHeight || window.innerHeight || docbody.clientHeight
		};
	}
}
