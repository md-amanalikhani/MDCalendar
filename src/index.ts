/**
 * In the name of Allah, the Beneficent, the Merciful.
 * @package The Calendar Related Extensions - SH (Solar Hijri, Shamsi Hijri, Iranian Hijri)
 * @author   Mohammad Amanalikhani
 * @link    http://docs.akhi.ir/js/SHCalendar
 * @copyright   Copyright (C) 2015 - 2022 Open Source Matters,Inc. All right reserved.
 * @license https://www.gnu.org/licenses/agpl-3.0.en.html AGPL-3.0 License
 * @version Release: 1.0.0
 */
import Word from "./word.js";
//import Lang_fa_IR from "./Lang/fa_IR.js";
import Selection from "./selection.js";
import SHDate from "@md-akhi/shdatetime";

export default class SHCalendar {
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

	lang = {};

	getlang = SHCalendar._; //func

	static defaultArgs = {
		cont: "",
		bottomBar: true,
		titleFormat: "%b %Y",
		dateFormat: "%Y-%m-%d",
		date: true,
		weekNumbers: false,
		time: true,
		fdow: SHCalendar._("fdow"),
		min: null,
		max: null,
		showTime: false,
		timePos: "right",
		minuteStep: 5,
		checkRange: false,
		animation: !SHCalendar.IS_IE6,
		opacity: SHCalendar.IS_IE ? 1 : 3,
		selection: [],
		selectionType: this.SEL_MULTIPLE,
		inputField: null,
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
	handlers: any;
	date: any;
	time: any;
	fdow: any;
	selection: any;
	els: any;
	_bodyAnim: any;
	_menuVisible: any;
	_bluringTimeout: any;
	focused: any;
	_menuAnim: any;
	_focusEvents: any;
	_selRangeStart: any;
	_mouseDiff: any;
	_lastHoverDate: any;
	_firstDateVisible: any;
	_lastDateVisible: any;
	_showAnim: any;
	constructor(args: any = {}) {
		this.args = this.setArgs(args, SHCalendar.defaultArgs);
		this.handlers = {};
		var date = new SHDate();
		args.min = this.setDate(args.min);
		args.max = this.setDate(args.max);
		if (args.date === true) args.date = date;
		if (args.time === true)
			args.time =
				date.getHours() * 100 +
				Math.floor(date.getMinutes() / args.minuteStep) * args.minuteStep;
		this.date = this.setDate(args.date);
		this.time = args.time;
		this.fdow = args.fdow;
		this.setFunction(
			"onChange onSelect onTimeChange onFocus onBlur onClose".split(/\s+/),
			(evname: string) => {
				var evn = args[evname];
				if (!(evn instanceof Array)) evn = [evn];
				this.handlers[evname] = evn;
			}
		);
		// this.selection = new Selection(
		// 	args.selection,
		// 	args.selectionType,
		// 	args.inputField,
		// 	this
		// );
		if (args.cont) this.getElementById(args.cont).appendChild(this.init());
		//args.trigger && this.manageFields(args.trigger,args.inputField, args.dateFormat),//popup
	}

	setArgs(args: object, defaultArgs: object): object {
		//E()
		return { ...defaultArgs, ...args };
		// let arg,
		// 	newArgs = {};
		// for (arg in SHCalendar.defaultArgs)
		// 	if (SHCalendar.defaultArgs.hasOwnProperty(arg))
		// 		newArgs[arg] = args[arg] || SHCalendar.defaultArgs[arg];
		// return newArgs;
	}

	getElementById(el: object | string) {
		if (typeof el == "string") return document.getElementById(el);
		return el;
	}

	setDate(date: SHDate | Date | any) {
		//k()
		if ("number" == typeof date) return SHCalendar.intToDate(date);
		if ("string" == typeof date) {
			var dateSpl = date.split(/-/);
			return new SHDate(
				parseInt(dateSpl[0], 10),
				parseInt(dateSpl[1], 10) - 1,
				parseInt(dateSpl[2], 10),
				12,
				0,
				0,
				0
			);
		}
		return date;
	}

	setFunction(event: string[], callback: Function) {
		//q()
		for (const key in event) callback(event[key]);
	}

	init() {
		var els: any;
		var el = this.createElement("div");
		els = this.els = {};
		var event: any = {
			mousedown: this.setEvent(this.mouseClick, true),
			mouseup: this.setEvent(this.mouseClick, false),
			mouseover: this.setEvent(this.mouseHover, true),
			mouseout: this.setEvent(this.mouseHover, false),
			keypress: this.setEvent(this.keypress),
			dblclick: SHCalendar.IS_IE ? event.mousedown : null,
			keydown: SHCalendar.IS_IE ? event.keypress : null
		};
		if (!this.args.noScroll) {
			event[SHCalendar.IS_GECKO ? "DOMMouseScroll" : "mousewheel"] =
				this.setEvent(this.wheelCHTime);
		}
		el.innerHTML = this.template();
		this.setNode(el.firstChild, (el: any) => {
			var el = this.#top_class[el.className];
			if (el) els[el] = el;
			if (SHCalendar.IS_IE) el.setAttribute("unselectable", "on");
		});
		this.addEvent(els.main, event);
		this.addEvent(
			[els.focusLink, els.yearInput],
			(this._focusEvents = {
				focus: this.setEvent(this.onFocus),
				blur: this.setEvent(this.onBluringTimeout)
			})
		);
		this.moveTo(this.date, false);
		this.setTime(null, true);
		return els.topCont;
	}

	createElement(type: any, className?: any, parent?: any) {
		//createElement(type, parent)
		var el = null; //el
		el = document.createElementNS
			? document.createElementNS("http://www.w3.org/1999/xhtml", type)
			: document.createElement(type);
		if (className) el.className = className;
		if (parent) parent.appendChild(el);
		return el;
	}

	setEvent(func: Function, ...args: any[]) {
		return () => {
			func.apply(this, args);
		};
	}

	stopEvent(event: any) {
		//stopEvent   N
		event = event || window.event;
		if (SHCalendar.IS_IE) {
			event.cancelBubble = true;
			event.returnValue = false;
		} else {
			event.preventDefault();
			event.stopPropagation();
		}
		return false;
	}

	addEvent(el: any, evname: any, func?: any, a?: any) {
		//addEvent = function(el, evname, func) {
		var i;
		if (el instanceof Array)
			for (i = el.length; --i >= 0; ) this.addEvent(el[i], evname, func, a);
		else if ("object" == typeof evname)
			for (i in evname)
				evname.hasOwnProperty(i) && this.addEvent(el, i, evname[i], func);
		else
			el.addEventListener
				? el.addEventListener(evname, func, SHCalendar.IS_IE ? true : !!a)
				: el.attachEvent
				? el.attachEvent("on" + evname, func)
				: (el["on" + evname] = func);
	}

	setNode(els: any, callback: Function) {
		//W
		if (!callback(els))
			for (var el = els.firstChild; el; el = el.nextSibling)
				if (el.nodeType == 1) this.setNode(el, callback);
	}

	mouseClick(io: boolean, event: any) {
		var dycType: any,
			timeOut: any,
			dycBtn: any,
			dTdycType,
			dycDate,
			selection,
			events: any,
			dTDycCls,
			u: any,
			DateDiv: any;
		event = event || window.event;
		dycType = this.getDycType(event);
		if (dycType && !dycType.getAttribute("disabled")) {
			dycBtn = dycType.getAttribute("dyc-btn");
			dTdycType = dycType.getAttribute("dyc-type");
			dycDate = dycType.getAttribute("dyc-date");
			selection = this.selection;
			events = {
				mouseover: this.stopEvent,
				mousemove: this.stopEvent,
				mouseup: function () {
					var dycCls = dycType.getAttribute("dyc-cls");
					if (dycCls) this.removeClass(dycType, this.Split(dycCls, 1));
					clearTimeout(timeOut);
					this.removeEvent(document, events, true);
					events = null;
				}
			};
			if (io) {
				setTimeout(this.setEvent(this.focus), 1);
				dTDycCls = dycType.getAttribute("dyc-cls");
				if (dTDycCls) this.addClass(dycType, this.Split(dTDycCls, 1));
				if ("menu" == dycBtn) {
					this.toggleMenu();
				} else if (dycType && /^[+-][MY]$/.test(dycBtn)) {
					if (this.chdate(dycBtn)) {
						(u = this.setEvent(() => {
							this.chdate(dycBtn, true)
								? (timeOut = setTimeout(u, 40))
								: (events.mouseup(), this.chdate(dycBtn));
						})),
							(timeOut = setTimeout(u, 350)),
							this.addEvent(document, events, true);
					} else events.mouseup();
				} else if ("year" == dycBtn) {
					this.els.yearInput.focus();
					this.els.yearInput.select();
				} else if ("time-am" == dTdycType) {
					this.addEvent(document, events, true);
				} else if (/^time/.test(dTdycType)) {
					u = this.setEvent((t: any) => {
						this.chtime(t);
						timeOut = setTimeout(u, 100);
					}, dTdycType);
					this.chtime(dTdycType);
					timeOut = setTimeout(u, 350);
					this.addEvent(document, events, true);
				} else if (dycDate && selection.type) {
					if (selection.type == SHCalendar.SEL_MULTIPLE) {
						if (event.shiftKey && this._selRangeStart) {
							selection.selectRange(this._selRangeStart, dycDate);
						} else if (
							event.ctrlKey ||
							selection.isSelected(dycDate) ||
							!this.args.multiCtrl
						) {
							selection.clear(true),
								selection.set(dycDate, true),
								(this._selRangeStart = dycDate);
						}
					} else {
						selection.set(dycDate),
							this.moveTo(SHCalendar.intToDate(dycDate), 2);
					}
					DateDiv = this._getDateDiv(dycDate);
					this.mouseHover.call(this, true, { target: DateDiv });
					this.addEvent(document, events, true);
				}
				if (SHCalendar.IS_IE && events && /dbl/i.test(event.type)) {
					events.mouseup();
				}
				if (
					this.args.fixed ||
					!/^(SHCalendar-(topBar|bottomBar|weekend|weekNumber|menu(-sep)?))?$/.test(
						DateDiv.className
					) ||
					this.args.cont
				) {
					events.mousemove = this.setEvent(this.dragIt);
					this._mouseDiff = this.position(
						event,
						this.getAbsolutePos(this.els.topCont)
					);
					this.addEvent(document, events, true);
				}
			} else if ("today" == dycBtn) {
				this._menuVisible ||
					selection.type != SHCalendar.SEL_SINGLE ||
					selection.set(new Date());
				this.moveTo(new Date(), true);
				this.showMenu(false);
			} else if (/^m([0-9]+)/.test(dycBtn)) {
				dycDate = new Date(this.date);
				dycDate.setDate(1);
				dycDate.setMonth(RegExp.$1);
				dycDate.setFullYear(this._getInputYear());
				this.moveTo(dycDate, true);
				this.showMenu(false);
			} else if ("time-am" == dTdycType) {
				this.setHours(this.getHours() + 12);
				SHCalendar.IS_IE || this.stopEvent(event);
			}
		}
	}

	keypress(event: any) {
		var target,
			dycBtn,
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
			dycBtn = target.getAttribute("dyc-btn");
			keyCode = event.keyCode;
			charCode = event.charCode || keyCode;
			r = this.#control_key[keyCode];
			if ("year" == dycBtn && 13 == keyCode) {
				date = new Date(this.date);
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
					this.chdate(r);
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
				monthName = SHCalendar._("mn");
				d = event.shiftKey ? -1 : this.date.getMonth();
				for (m = 0; ++m < 12; ) {
					MN = monthName[(d + m) % 12].toLowerCase();
					if (MN.indexOf(charCode) == 0) {
						date = new Date(this.date);
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
						(p = date), (date = SHCalendar.intToDate(date));
						for (d = 100; d-- > 0; ) {
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
						date = this.dateToInt(date);
						if (date < this._firstDateVisible || date > this._lastDateVisible)
							this.moveTo(date);
					} else
						date =
							39 > keyCode ? this._lastDateVisible : this._firstDateVisible;
					this.removeClass(
						this._getDateDiv(p),
						this.addClass(this._getDateDiv(date), "SHCalendar-hover-date")
					),
						(this._lastHoverDate = date);
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

	mouseHover(io: boolean, even: any) {
		// D()
		var DycType, dTdycType, dycCls;
		(even = even || window.event),
			(DycType = this.getDycType(even)),
			DycType &&
				((dTdycType = DycType.getAttribute("dyc-type")),
				dTdycType &&
					!DycType.getAttribute("disabled") &&
					((io && this._bodyAnim && "date" == dTdycType) ||
						((dycCls = DycType.getAttribute("dyc-cls")),
						(dycCls = dycCls
							? this.Split(dycCls, 0)
							: "SHCalendar-hover-" + dTdycType),
						("date" != dTdycType || this.selection.type) &&
							this.array_addCalss(io, DycType, dycCls),
						"date" == dTdycType &&
							(this.array_addCalss(
								io,
								DycType.parentNode.parentNode,
								"SHCalendar-hover-week"
							),
							this._showTooltip(DycType.getAttribute("dyc-date"))),
						/^time-hour/.test(dTdycType) &&
							this.array_addCalss(
								io,
								this.els.timeHour,
								"SHCalendar-hover-time"
							),
						/^time-min/.test(dTdycType) &&
							this.array_addCalss(
								io,
								this.els.timeMinute,
								"SHCalendar-hover-time"
							),
						this.removeClass(
							this._getDateDiv(this._lastHoverDate),
							"SHCalendar-hover-date"
						),
						(this._lastHoverDate = null)))),
			io || this._showTooltip();
	}

	wheelCHTime(event: any) {
		// b()
		var dycType, dycBtn, dycType, wheelStep;
		if (((event = event || window.event), (dycType = this.getDycType(event)))) {
			(dycBtn = dycType.getAttribute("dyc-btn")),
				(dycType = dycType.getAttribute("dyc-type")),
				(wheelStep = event.wheelDelta
					? event.wheelDelta / 120
					: -event.detail / 3),
				(wheelStep = 0 > wheelStep ? -1 : wheelStep > 0 ? 1 : 0),
				this.args.reverseWheel && (wheelStep = -wheelStep);
			if (/^(time-(hour|min))/.test(dycType)) {
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
			} else
				/Y/i.test(dycBtn) && (wheelStep *= 2),
					this.chdate(-wheelStep),
					this.stopEvent(event);
		}
	}

	static setup(args = {}) {
		return new SHCalendar(args);
	}

	redraw() {
		var els = this.els;
		this.refresh();
		els.dayNames.innerHTML = this.Weeks(this.args.weekNumbers, this.fdow);
		els.menu.innerHTML = this.Menu();
		if (els.bottomBar) els.bottomBar.innerHTML = this.BottomBar(this.args);
		this.setNode(els.topCont, (el: any) => {
			var cls = this.#top_class[el.className];
			if (cls) els[cls] = el;
			if (el.className == "SHCalendar-menu-year") {
				this.addEvent(el, this._focusEvents), (els.yearInput = el);
			} else if (SHCalendar.IS_IE) el.setAttribute("unselectable", "on");
		}),
			this.setTime(null, true);
	}

	static formatString(str: string, prop: any) {
		//M()
		return str.replace(/\$\{([^:\}]+)(:[^\}]+)?\}/g, function (str, n, a) {
			var s,
				i = prop[n];
			return (
				a &&
					((s = a.substr(1).split(/\s*\|\s*/)),
					(i = (i < s.length ? s[i] : s[s.length - 1]).replace(
						/##?/g,
						function (str: string) {
							return str.length == 2 ? "#" : i;
						}
					))),
				i
			);
		});
	}

	static intToDate(
		date: any,
		hours = null,
		minute = null,
		second = null,
		milliSecond = null
	) {
		//A()
		var year, month;
		date instanceof Date ||
			((date = parseInt(date, 10)),
			(year = Math.floor(date / 1e4)),
			(date %= 1e4),
			(month = Math.floor(date / 100)),
			(date %= 100), //day
			(date = new Date(
				year,
				month - 1,
				date,
				null == hours ? 12 : hours,
				null == minute ? 0 : minute,
				null == second ? 0 : second,
				null == milliSecond ? 0 : milliSecond
			)));
		return date;
	}

	dateToInt(date: any) {
		//L()
		if (date instanceof Date)
			return (
				date.getFullYear() * 1e4 + (date.getMonth() + 1) * 100 + date.getDate()
			);
		else if (typeof date == "string") return parseInt(date, 10);
		return date;
	}

	focus() {
		try {
			this.els[this._menuVisible ? "yearInput" : "focusLink"].focus();
		} catch (t) {}
		this.onFocus.call(this);
	}

	blur() {
		this.els.focusLink.blur(),
			this.els.yearInput.blur(),
			this.onBlur.call(this);
	}
	onFocus() {
		//c
		if (this._bluringTimeout) clearTimeout(this._bluringTimeout);
		(this.focused = true),
			this.addClass(this.els.main, "DynarchCalendar-focused"),
			this.callHooks("onFocus");
	}

	onBlur() {
		//h
		(this.focused = false),
			this.removeClass(this.els.main, "DynarchCalendar-focused");
		if (this._menuVisible) this.showMenu(false);
		if (!this.args.cont) this.hide();
		this.callHooks("onBlur");
	}

	onBluringTimeout() {
		//u
		this._bluringTimeout = setTimeout(this.setEvent(this.onBlur), 50);
	}
	callHooks(evname: string, ...arg: any[]) {
		var a,
			e = this.U(arguments, 1),
			n = this.handlers[evname];
		for (a = 0; a < n.length; ++a) n[a].apply(this, e);
	}

	addEventListener(evname: string, func: Function) {
		this.handlers[evname].push(func);
	}

	removeEventListener(evname: string, func: Function) {
		var a,
			n = this.handlers[evname];
		for (a = n.length; --a >= 0; ) n[a] === func && n.splice(a, 1);
	}

	getTime() {
		return this.time;
	}

	getHours() {
		return Math.floor(this.time / 100);
	}

	getMinutes() {
		return this.time % 100;
	}

	setHours(H: number) {
		if (0 > H) {
			H += 24;
		}
		this.setTime(100 * (H % 24) + (this.time % 100));
	}

	setMinutes(M: number) {
		0 > M && (M += 60),
			(M = Math.floor(M / this.args.minuteStep) * this.args.minuteStep),
			this.setTime(100 * this.getHours() + (M % 60));
	}

	setTime(time: any, nohooks = false) {
		//time, [ nohooks ]
		var Hours, Minutes, inputField, selection, print;
		if (this.args.showTime) {
			time = null != time ? time : this.time;
			this.time = time;
			Hours = this.getHours();
			Minutes = this.getMinutes();
			if (this.args.showTime == 12) {
				if (0 == Hours) {
					Hours = 12;
				}
				if (Hours > 12) {
					Hours -= 12;
				}
				this.els.timeAM.innerHTML = SHCalendar._(12 > Hours ? "AM" : "PM");
			}
			if (10 > Hours) {
				Hours = "0" + Hours;
			}
			if (10 > Minutes) {
				Minutes = "0" + Minutes;
			}
			this.els.timeHour.innerHTML = Hours;
			this.els.timeMinute.innerHTML = Minutes;
			if (!nohooks) {
				this.callHooks("onTimeChange", time);
				inputField = this.args.inputField;
				selection = this.selection;
				if (inputField) {
					print = selection.print(this.args.dateFormat);
					if (/input|textarea/i.test(inputField.tagName)) {
						inputField.value = print;
					} else {
						inputField.innerHTML = print;
					}
				}
			}
		}
	}

	_getInputYear() {
		var year = parseInt(this.els.yearInput.value, 10);
		if (isNaN(year)) {
			year = this.date.getFullYear();
		}
		return year;
	}

	getDycType(t: any) {
		// get dyc-type
		for (
			var e = t.target || t.srcElement, n = e;
			e && e.getAttribute && !e.getAttribute("dyc-type");

		)
			e = e.parentNode;
		return (e.getAttribute && e) || n;
	}

	Split(string: string, index: number) {
		return "SHCalendar-" + string.split(/,/)[index];
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
				if (n == e) stop();
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

	moveTo(date: Date | SHDate, animation?: any) {
		//date , animation
		var a: any,
			datedif: any,
			args,
			min,
			max,
			body: any,
			el: any,
			firstChild,
			u: any,
			ddbool: any,
			fcoffsetTL,
			elstyle: any,
			boffsetHW: any,
			cloneNode: any,
			cnstyle: any,
			/*  v, */ tis = this;
		date = this.setDate(date);
		datedif = this.dateDiff(date, tis.date, true);
		(args = tis.args(
			(min = tis.args.min && this.dateDiff(date, tis.args.min))
		)),
			(max = args.max && this.dateDiff(date, args.max)),
			args.animation || (animation = false),
			this.array_addCalss(
				null != min && 1 >= min,
				[tis.els.navPrevMonth, tis.els.navPrevYear],
				"SHCalendar-navDisabled"
			),
			this.array_addCalss(
				null != max && max >= -1,
				[tis.els.navNextMonth, tis.els.navNextYear],
				"SHCalendar-navDisabled"
			),
			-1 > min && ((date = args.min), (a = 1), (datedif = 0)),
			max > 1 && ((date = args.max), (a = 2), (datedif = 0)),
			(tis.date = date),
			tis.refresh(!!animation),
			tis.callHooks("onChange", date, animation),
			!animation ||
				(0 == datedif && 2 == animation) ||
				(tis._bodyAnim && tis._bodyAnim.stop(),
				(body = tis.els.body),
				(el = tis.createElement(
					"div",
					"SHCalendar-animBody-" + this.#control_button[datedif],
					body
				)),
				(firstChild = body.firstChild),
				tis.setOpacity(firstChild) || 0.7,
				(u = a
					? this.#math_animation.brakes
					: 0 == datedif
					? this.#math_animation.shake
					: this.#math_animation.accel_ab2),
				(ddbool = datedif * datedif > 4),
				(fcoffsetTL = ddbool ? firstChild.offsetTop : firstChild.offsetLeft),
				(elstyle = el.style),
				(boffsetHW = ddbool ? body.offsetHeight : body.offsetWidth),
				0 > datedif
					? (boffsetHW += fcoffsetTL)
					: datedif > 0
					? (boffsetHW = fcoffsetTL - boffsetHW)
					: ((boffsetHW = Math.round(boffsetHW / 7)),
					  2 == a && (boffsetHW = -boffsetHW)),
				a ||
					0 == datedif ||
					((cloneNode = el.cloneNode(true)),
					(cnstyle = cloneNode.style),
					//v = 2 * boffsetHW,
					cloneNode.appendChild(firstChild.cloneNode(true)),
					(cnstyle[ddbool ? "marginTop" : "marginLeft"] = boffsetHW + "px"),
					body.appendChild(cloneNode)),
				(firstChild.style.visibility = "hidden"),
				(el.innerHTML = this.Day()),
				(tis._bodyAnim = this.Animation({
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
							tis.args.opacity > 2 &&
								cloneNode &&
								(this.setOpacity(cloneNode, 1 - i), this.setOpacity(el, i));
					},
					onStop: function () {
						(body.innerHTML = this.Day(date)), (tis._bodyAnim = null);
					}
				}))),
			(tis._lastHoverDate = null);
		return min >= -1 && 1 >= max;
	}

	isDisabled(date: Date | SHDate) {
		var args = this.args;
		return (
			(args.min && this.dateDiff(date, args.min) < 0) ||
			(args.max && this.dateDiff(date, args.max) > 0) ||
			args.disabled(date)
		);
	}

	toggleMenu() {
		this.showMenu(!this._menuVisible);
	}

	refresh(noBody?: boolean) {
		var els = this.els;
		noBody || (els.body.innerHTML = this.Day()),
			(els.title.innerHTML = this.Title()),
			(els.yearInput.value = this.date.getFullYear());
	}

	showMenu(visible: any) {
		// show menu

		var menu: any,
			offsetHeight: any,
			tis = this;
		(tis._menuVisible = visible),
			this.array_addCalss(visible, tis.els.title, "SHCalendar-pressed-title"),
			(menu = tis.els.menu),
			SHCalendar.IS_IE6 &&
				(menu.style.height = tis.els.main.offsetHeight + "px"),
			tis.args.animation
				? (tis._menuAnim && tis._menuAnim.stop(),
				  (offsetHeight = tis.els.main.offsetHeight),
				  SHCalendar.IS_IE6 &&
						(menu.style.width = tis.els.topBar.offsetWidth + "px"),
				  visible &&
						((menu.firstChild.style.marginTop = -offsetHeight + "px"),
						tis.args.opacity > 0 && this.setOpacity(menu, 0),
						this.styleDisplay(menu, true)),
				  (tis._menuAnim = this.Animation({
						onUpdate: function (s: number, i: Function) {
							(menu.firstChild.style.marginTop =
								i(this.#math_animation.accel_b(s), -offsetHeight, 0, !visible) +
								"px"),
								tis.args.opacity > 0 &&
									this.setOpacity(
										menu,
										i(this.#math_animation.accel_b(s), 0, 0.85, !visible)
									);
						},
						onStop: function () {
							tis.args.opacity > 0 && this.setOpacity(menu, 0.85),
								(menu.firstChild.style.marginTop = ""),
								(tis._menuAnim = null),
								visible ||
									(this.styleDisplay(menu, false), tis.focused && tis.focus());
						}
				  })))
				: (this.styleDisplay(menu, visible), tis.focused && tis.focus());
	}

	styleDisplay(el: any, isDisplay: any) {
		// display
		return (
			null != isDisplay && (el.style.display = isDisplay ? "" : "none"),
			el.style.display != "none"
		);
	}

	removeClass(el: any, oldClass?: any, newClass?: any) {
		// Y
		if (el) {
			var len,
				cls = el.className.replace(/^\s+|\s+$/, "").split(/\x20/),
				array = [];
			for (len = cls.length; len > 0; )
				if (cls[--len] != oldClass) array.push(cls[len]);
			if (newClass) array.push(newClass);
			el.className = array.join(" ");
		}
		return newClass;
	}

	addClass(el: any, newClass: any) {
		// P
		return this.removeClass(el, newClass, newClass);
	}

	array_addCalss(isChange: any, el: any, newClass: any) {
		// R
		if (el instanceof Array)
			for (var item = el.length; --item >= 0; )
				this.array_addCalss(isChange, el[item], newClass);
		else this.removeClass(el, newClass, isChange ? newClass : null);
		return isChange;
	}

	dateDiff(first_date: any, second_date: any, n?: any) {
		//H()
		var ty = first_date.getFullYear(),
			tm = first_date.getMonth(),
			td = first_date.getDate(),
			ey = second_date.getFullYear(),
			em = second_date.getMonth(),
			ed = second_date.getDate();
		if (ey > ty) {
			return -3;
		} else if (ty > ey) {
			return 3;
		} else if (em > tm) {
			return -2;
		} else if (tm > em) {
			return 2;
		} else if (n) {
			return 0;
		} else if (ed > td) {
			return -1;
		} else if (td > ed) {
			return 1;
		}
		return 0;
	}

	_getDateDiv(t: any) {
		var e = null;
		if (t)
			try {
				this.setNode(this.els.body, function (n: any) {
					if (n.getAttribute("dyc-date") == t) throw (e = n);
				});
			} catch (n) {}
		return e;
	}

	chdate(dycBtn: any, anim?: any) {
		// f()
		this._bodyAnim && this._bodyAnim.stop();
		if (0 != dycBtn) {
			var data = new Date(this.date);
			data.setDate(1);
			switch (dycBtn) {
				case "-Y":
				case -2:
					data.setFullYear(data.getFullYear() - 1);
					break;
				case "+Y":
				case 2:
					data.setFullYear(data.getFullYear() + 1);
					break;
				case "-M":
				case -1:
					data.setMonth(data.getMonth() - 1);
					break;
				case "+M":
				case 1:
					data.setMonth(data.getMonth() + 1);
			}
		} else data = new Date();
		return this.moveTo(data, !anim);
	}

	chtime(dycType: string) {
		// d()
		switch (dycType) {
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
			default:
				return;
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

	hide() {
		this.callHooks("onClose", this);
		var topCont = this.els.topCont,
			firstChild = this.els.body.firstChild,
			offsetHeight = firstChild.offsetHeight,
			s = this.getAbsolutePos(topCont).y,
			tis = this;
		if (this.args.animation) {
			if (this._showAnim) this._showAnim.stop();
			this._showAnim = this.Animation({
				onUpdate: (i: number, r: Function) => {
					if (tis.args.opacity > 1) this.setOpacity(topCont, 1 - i);
					(firstChild.style.marginTop =
						-r(this.#math_animation.accel_b(i), 0, offsetHeight) + "px"),
						(topCont.style.top =
							r(this.#math_animation.accel_ab(i), s, s - 10) + "px");
				},
				onStop: () => {
					(topCont.style.display = "none"), (firstChild.style.marginTop = "");
					if (tis.args.opacity > 1) this.setOpacity(topCont, "");
					tis._showAnim = null;
				}
			});
		} else topCont.style.display = "none";
		SHCalendar.defaultArgs.inputField = null;
	}

	_showTooltip(date: Date | SHDate = new SHDate()) {
		var dateInfo,
			str = "",
			tooltip = this.els.tooltip;
		if (date) {
			date = SHCalendar.intToDate(date);
			dateInfo = this.args.dateInfo(date);
			if (dateInfo && dateInfo.tooltip) {
				str =
					"<div class='SHCalendar-tooltipCont'>" +
					this.printDate(date, dateInfo.tooltip) +
					"</div>";
			}
		}
		tooltip.innerHTML = str;
	}

	printDate(date: Date | SHDate, str: string) {
		//S()
		var n: any,
			m = date.getMonth(),
			d = date.getDate(),
			y = date.getFullYear(),
			wk = this.getWeekNumber(date),
			dow = date.getDay(),
			h = date.getHours(),
			pm = h >= 12,
			ir = pm ? h - 12 : h,
			doy = this.getDayOfYear(date),
			i = date.getMinutes(),
			s = date.getSeconds(),
			reg = /%./g;
		0 === ir && (ir = 12),
			(n = {
				"%a": SHCalendar._("sdn")[dow],
				"%A": SHCalendar._("dn")[dow],
				"%b": SHCalendar._("smn")[m],
				"%B": SHCalendar._("mn")[m],
				"%C": 1 + Math.floor(y / 100),
				"%d": 10 > d ? "0" + d : d,
				"%e": d,
				"%H": 10 > h ? "0" + h : h,
				"%I": 10 > ir ? "0" + ir : ir,
				"%j": 10 > doy ? "00" + doy : 100 > doy ? "0" + doy : doy,
				"%k": h,
				"%l": ir,
				"%m": 9 > m ? "0" + (1 + m) : 1 + m,
				"%o": 1 + m,
				"%M": 10 > i ? "0" + i : i,
				"%n": "\n",
				"%p": pm ? "PM" : "AM",
				"%P": pm ? "pm" : "am",
				"%s": Math.floor(date.getTime() / 1e3),
				"%S": 10 > s ? "0" + s : s,
				"%t": "	",
				"%U": 10 > wk ? "0" + wk : wk,
				"%W": 10 > wk ? "0" + wk : wk,
				"%V": 10 > wk ? "0" + wk : wk,
				"%u": dow + 1,
				"%w": dow,
				"%y": ("" + y).substr(2, 2),
				"%Y": y,
				"%%": "%"
			});
		return str.replace(reg, function (t: any) {
			return n.hasOwnProperty(t) ? n[t] : t;
		});
	}

	getLanguage(name: string, lang: string = this.#lang) {
		switch (name) {
			case "fdow":
				return Word.getFirstDayOfWeek( lang);
			case "goToday":
				return Word.isRTL( lang);
			case "today":
				return Word.getFirstDayOfWeek(name, lang);
			case "wk":
				return Word.getFirstDayOfWeek(name, lang);
			case "weekend":
				return Word.getFirstDayOfWeek(name, lang);
			case "AM":
				return Word.getFirstDayOfWeek(name, lang);
			case "PM":
				return Word.getFirstDayOfWeek(name, lang);
			case "mn":
				return Word.getFirstDayOfWeek(name, lang);
			case "smn":
				return Word.getFirstDayOfWeek(name, lang);
			case "dn":
				return Word.getFirstDayOfWeek(name, lang);
			case "sdn":
				return Word.getFirstDayOfWeek(name, lang);
		}
		SHCalendar.lang._ = SHCalendar.lang[shortName] = {
			name: name,
			data: this.setArgs(data, {
				smn: [
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
				],
				dn: [
					"Sunday",
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
					"Sunday"
				],
				sdn: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
			})
		};
	}

	static _(t: any, prop = false) {
		// _()
		var str = Word.data[t];
		if (prop && "string" == typeof str) {
			str = SHCalendar.formatString(str, prop);
		}
		return str;
	}

	#lang = "en_US";
	setLanguage(lang: any) {
		this.#lang = Word.checkLanguage(lang);
		if (lang) {
			this.fdow = Word.getFirstDayOfWeek;
			this.redraw();
		}
	}

	getWeekNumber(date: Date | SHDate) {
		var dow, ms;
		return (
			(date = new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
				12,
				0,
				0
			)),
			(dow = date.getDay()),
			date.setDate(date.getDate() - ((dow + 6) % 7) + 3), // Nearest Thu
			(ms = date.valueOf()), // GMT
			date.setMonth(0),
			date.setDate(4), // Thu in Week 1
			Math.round((ms - date.valueOf()) / 6048e5) + 1
		);
	}

	getDayOfYear(date: Date | SHDate) {
		var e, time, now: any, then: any;
		(now = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			12,
			0,
			0
		)),
			(then = new Date(date.getFullYear(), 0, 1, 12, 0, 0)),
			(time = now - then);
		return Math.floor(time / 864e5);
	}

	U(t: any, e: any) {
		null == e && (e = 0);
		var n, a, s;
		try {
			n = Array.prototype.slice.call(t, e);
		} catch (i) {
			for (n = Array(t.length - e), a = e, s = 0; a < t.length; ++a, ++s)
				n[s] = t[a];
		}
		return n;
	}

	template() {
		//Calendar
		var tis = this,
			str = [
				"<table class='SHCalendar-topCont' align='center' cellspacing='0' cellpadding='0'><tr><td><div class='SHCalendar'>",
				SHCalendar.IS_IE
					? "<a class='SHCalendar-focusLink' href='#'></a>"
					: "<button class='SHCalendar-focusLink'></button>",
				"<div class='SHCalendar-topBar'><div dyc-type='nav' dyc-btn='-Y' dyc-cls='hover-navBtn,pressed-navBtn' ",
				"class='SHCalendar-navBtn SHCalendar-prevYear'><div></div></div><div dyc-type='nav' dyc-btn='+Y' dyc-cls='hover-navBtn,pressed-navBtn' ",
				"class='SHCalendar-navBtn SHCalendar-nextYear'><div></div></div><div dyc-type='nav' dyc-btn='-M' dyc-cls='hover-navBtn,pressed-navBtn' ",
				"class='SHCalendar-navBtn SHCalendar-prevMonth'><div></div></div><div dyc-type='nav' dyc-btn='+M' dyc-cls='hover-navBtn,pressed-navBtn' ",
				"class='SHCalendar-navBtn SHCalendar-nextMonth'><div></div></div><table class='SHCalendar-titleCont' align='center' cellspacing='0' cellpadding='0'><tr><td><div dyc-type='title' dyc-btn='menu' dyc-cls='hover-title,pressed-title' class='SHCalendar-title'><div unselectable='on'>" +
					this.printDate(tis.date, tis.args.titleFormat) +
					"</div></div></td></tr></table><div class='SHCalendar-dayNames'>",
				this.Weeks(),
				"</div></div><div class='SHCalendar-body'></div>"
			];
		(tis.args.bottomBar || tis.args.showTime) &&
			str.push("<div class='SHCalendar-bottomBar'>", this.Today(), "</div>"),
			str.push(
				"<div class='SHCalendar-menu' style='display: none'>",
				this.Menu(),
				"</div><div class='SHCalendar-tooltip'></div></div></td></tr></table>"
			);
		return str.join("");
	}

	Menu() {
		//i()
		var k,
			i,
			j,
			str,
			shortMN,
			tis = this;
		(str = [
			"<table height='100%'",
			" align='center' cellspacing='0' cellpadding='0'",
			"><tr><td><table style='margin-top: 1.5em'",
			" align='center' cellspacing='0' cellpadding='0'",
			">",
			"<tr><td colspan='3'><input dyc-btn='year' class='SHCalendar-menu-year' size='6' value='",
			this.date.getFullYear(),
			"' /></td><td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='today'>",
			this.date.getFullYear(),
			"</div></td></tr><tr><td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='today'>",
			SHCalendar._("goToday"),
			"</div></td></tr></table><p class='SHCalendar-menu-sep'>&nbsp;</p><table class='SHCalendar-menu-mtable'",
			" align='center' cellspacing='0' cellpadding='0'",
			">"
		]),
			(shortMN = SHCalendar._("smn"));
		for (i = 0, j = str.length; 12 > i; ) {
			str[j++] = "<tr>";
			for (k = 5; --k > 0; )
				str[j++] =
					"<td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='m" +
					i +
					"' class='SHCalendar-menu-month'>" +
					shortMN[i++] +
					"</div></td>";
			str[j++] = "</tr>";
		}
		str[j++] = "</table></td></tr></table>";
		return str.join("");
	}

	Weeks(wk = null, fdow = null) {
		//Calendar-weekNumber
		var e,
			tis = this,
			n = ["<table align='center' cellspacing='0' cellpadding='0'><tr>"],
			a = 0;
		tis.args.weekNumbers &&
			n.push(
				"<td><div class='SHCalendar-weekNumber'>",
				SHCalendar._("wk"),
				"</div></td>"
			);
		for (; 7 > a; )
			(e = (a++ + tis.fdow) % 7),
				n.push(
					"<td><div",
					SHCalendar._("weekend").indexOf(e) < 0
						? ">"
						: " class='SHCalendar-weekend'>",
					SHCalendar._("sdn")[e],
					"</div></td>"
				);
		n.push("</tr></table>");
		return n.join("");
	}

	Day(date?: Date | SHDate, fdow?: number) {
		//Calendar-day
		var monthnow,
			str = [],
			i = 0,
			wk,
			dow,
			datet,
			day,
			month,
			year,
			horizontal,
			vertical,
			dayt,
			montht,
			yeart,
			fulldate,
			selected,
			disabled,
			tis = this;
		date = date || this.date;
		fdow = fdow || this.fdow;
		date = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			12,
			0,
			0,
			0
		);
		monthnow = date.getMonth();
		wk = this.args.weekNumbers;
		date.setDate(1);
		dow = (date.getDay() - fdow) % 7;
		0 > dow && (dow += 7);
		date.setDate(0 - dow);
		date.setDate(date.getDate() + 1);
		datet = new Date();
		day = datet.getDate();
		month = datet.getMonth();
		year = datet.getFullYear();
		str[i++] =
			"<table class='SHCalendar-bodyTable'" +
			" align='center' cellspacing='0' cellpadding='0'" +
			">";
		for (horizontal = 0; 6 > horizontal; ++horizontal) {
			(str[i++] = "<tr class='SHCalendar-week"),
				0 == horizontal && (str[i++] = " SHCalendar-first-row"),
				5 == horizontal && (str[i++] = " SHCalendar-last-row"),
				(str[i++] = "'>"),
				wk &&
					(str[i++] =
						"<td class='SHCalendar-first-col'><div class='SHCalendar-weekNumber'>" +
						this.getWeekNumber(date) +
						"</div></td>");
			for (vertical = 0; 7 > vertical; ++vertical)
				(dayt = date.getDate()),
					(montht = date.getMonth()),
					(yeart = date.getFullYear()),
					(fulldate = 1e4 * yeart + 100 * (montht + 1) + dayt),
					(selected = tis.selection.isSelected(fulldate)),
					(disabled = tis.isDisabled(date)),
					(str[i++] = "<td class='"),
					0 != vertical || wk || (str[i++] = " SHCalendar-first-col"),
					0 == vertical &&
						0 == horizontal &&
						(tis._firstDateVisible = fulldate),
					6 == vertical &&
						((str[i++] = " SHCalendar-last-col"),
						5 == horizontal && (tis._lastDateVisible = fulldate)),
					selected && (str[i++] = " SHCalendar-td-selected"),
					(str[i++] =
						"'><div dyc-type='date' unselectable='on' dyc-date='" +
						fulldate +
						"' "),
					disabled && (str[i++] = "disabled='1' "),
					(str[i++] = "class='SHCalendar-day"),
					SHCalendar._("weekend").indexOf(date.getDay()) < 0 ||
						(str[i++] = " SHCalendar-weekend"),
					montht != monthnow && (str[i++] = " SHCalendar-day-othermonth"),
					dayt == day &&
						montht == month &&
						yeart == year &&
						(str[i++] = " SHCalendar-day-today"),
					disabled && (str[i++] = " SHCalendar-day-disabled"),
					selected && (str[i++] = " SHCalendar-day-selected"),
					(disabled = tis.args.dateInfo(date)),
					disabled && disabled.klass && (str[i++] = " " + disabled.klass),
					(str[i++] = "'>" + dayt + "</div></td>"),
					(date = new Date(yeart, montht, dayt + 1, 12, 0, 0, 0));
			str[i++] = "</tr>";
		}
		str[i++] = "</table>";
		return str.join("");
	}

	Time(e: any) {
		//print Calendar-time

		e.push(
			"<table class='SHCalendar-time'" +
				" align='center' cellspacing='0' cellpadding='0'" +
				"><tr><td rowspan='2'><div dyc-type='time-hour' dyc-cls='hover-time,pressed-time' class='SHCalendar-time-hour'></div></td><td dyc-type='time-hour+' dyc-cls='hover-time,pressed-time' class='SHCalendar-time-up'></td><td rowspan='2' class='SHCalendar-time-sep'></td><td rowspan='2'><div dyc-type='time-min' dyc-cls='hover-time,pressed-time' class='SHCalendar-time-minute'></div></td><td dyc-type='time-min+' dyc-cls='hover-time,pressed-time' class='SHCalendar-time-up'></td>"
		),
			this.args.showTime == 12 &&
				e.push(
					"<td rowspan='2' class='SHCalendar-time-sep'></td><td rowspan='2'><div class='SHCalendar-time-am' dyc-type='time-am' dyc-cls='hover-time,pressed-time'></div></td>"
				),
			e.push(
				"</tr><tr><td dyc-type='time-hour-' dyc-cls='hover-time,pressed-time' class='SHCalendar-time-down'></td><td dyc-type='time-min-' dyc-cls='hover-time,pressed-time' class='SHCalendar-time-down'></td></tr></table>"
			);
		return e;
	}

	Today() {
		// print Today
		var tis = this,
			n = [],
			a = tis.args;
		n.push(
			"<table",
			" align='center' cellspacing='0' cellpadding='0'",
			" style='width:100%'><tr>"
		),
			a.timePos == "left" &&
				a.showTime &&
				(n.push("<td>"), this.Time(n), n.push("</td>")),
			a.bottomBar &&
				n.push(
					"<td><table",
					" align='center' cellspacing='0' cellpadding='0'",
					"><tr><td><div dyc-btn='today' dyc-cls='hover-bottomBar-today,pressed-bottomBar-today' dyc-type='bottomBar-today' class='SHCalendar-bottomBar-today'>",
					SHCalendar._("today"),
					"</div></td></tr></table></td>"
				),
			a.timePos == "right" &&
				a.showTime &&
				(n.push("<td>"), this.Time(n), n.push("</td>")),
			n.push("</tr></table>");
		return n.join("");
	}

	Title() {
		//Title
		return (
			"<div unselectable='on'>" +
			this.printDate(this.date, this.args.titleFormat) +
			"</div>"
		);
	}
	BottomBar(args: any) {
		// o
		const time = () => {
			table.push("<td>", this.Time(table), "</td>");
		};
		var table = [
			"<table",
			"align='center' cellspacing='0' cellpadding='0'",
			" style='width:100%'><tr>"
		];
		if (args.showTime && args.timePos == "left") time();
		if (args.bottomBar) {
			table.push(
				"<td><table",
				"align='center' cellspacing='0' cellpadding='0'",
				"><tr><td>",
				"<div dyc-btn='today' dyc-cls='hover-bottomBar-today,pressed-bottomBar-today' dyc-type='bottomBar-today' ",
				"class='DynarchCalendar-bottomBar-today'>",
				SHCalendar._("today"),
				"</div>",
				"</td></tr></table></td>"
			);
		}
		if (args.showTime && args.timePos == "right") time();
		table.push("</tr></table>");
		return table.join("");
	}
}
