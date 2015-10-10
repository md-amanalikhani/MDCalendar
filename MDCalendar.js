
/**
	* In The Name Of God
	* @package MDCalendar
    * @author   MohammaD (MD) Amanalikhani
	* @link    http://md-amanalikhani.github.io | http://md.akhi.ir
	* @copyright   Copyright (C) 2015 - 2020 Open Source Matters,Inc. All right reserved.
	* @license http://www.php.net/license/3_0.txt  PHP License 3.0
	* @version Release: 1.0.0
	*/	

 var dw=function(obj) {
    var out = "\n\n";
	if("object" == typeof obj || "array" == typeof obj) 
		for (var i in obj) {
			out += i + " : " + obj[i] +"\n";
		}
	out += obj +"\n";
    var pre = document.createElement('pre');
    pre.innerHTML = out+ "\n\n";
    document.body.appendChild(pre)
}
 
 

/** The Calendar object constructor. */
jscal = function() {

	var is_opera = /opera/i.test(navigator.userAgent)//is_opera
		is_khtml = /Konqueror|Safari|KHTML/i.test(navigator.userAgent),//is_khtml
        is_ie= /msie/i.test(navigator.userAgent) && !is_opera && !/mac_powerpc/i.test(navigator.userAgent),//is_ie
        is_ie6 = is_ie && /msie 6/i.test(navigator.userAgent),//is_ie6
        is_gecko = /gecko/i.test(navigator.userAgent) && !is_khtml && !is_opera && !is_ie//is_gecko
		jscal.SEL_NONE = 0,
		jscal.SEL_SINGLE = 1, 
		jscal.SEL_MULTIPLE = 2, 
		jscal.SEL_WEEK = 3,
		jscal.lang = {},
		jscal.getlang = _,//func
		Q = " align='center' cellspacing='0' cellpadding='0'", 
		Z = {
        "MDCalendar-topCont": "topCont",
        "MDCalendar-focusLink": "focusLink",
        "MDCalendar": "main",
        "MDCalendar-topBar": "topBar",
        "MDCalendar-title": "title",
        "MDCalendar-dayNames": "dayNames",
        "MDCalendar-body": "body",
        "MDCalendar-menu": "menu",
        "MDCalendar-menu-year": "yearInput",
        "MDCalendar-bottomBar": "bottomBar",
        "MDCalendar-tooltip": "tooltip",
        "MDCalendar-time-hour": "timeHour",
        "MDCalendar-time-minute": "timeMinute",
        "MDCalendar-time-am": "timeAM",
        "MDCalendar-navBtn MDCalendar-prevYear": "navPrevYear",
        "MDCalendar-navBtn MDCalendar-nextYear": "navNextYear",
        "MDCalendar-navBtn MDCalendar-prevMonth": "navPrevMonth",
        "MDCalendar-navBtn MDCalendar-nextMonth": "navNextMonth"
		}
		
	function jscal (args) {
		var args = args || {}
			this.args = args = argDiff(args,{
            cont: null,
            bottomBar: true,
            titleFormat: "%b %Y",
			dateFormat: "%Y-%m-%d",
            date: true,
            weekNumbers: false,
            time: true,
			fdow: _("fdow"),
            min: null,
            max: null,
            showTime: false,
            timePos: "right",
            minuteStep: 5,
            checkRange: false,
            animation: !is_ie6,
            opacity: is_ie ? 1 : 3,
            selection: [],
            selectionType: jscal.SEL_SINGLE,
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
			}),
			this.handlers = {}, 
			date = new Date,
			args.min = setDate(args.min), 
			args.max = setDate(args.max), 
			args.date === true && (args.date = date),
			args.time === true && (args.time = date.getHours() * 100 + Math.floor(date.getMinutes() / args.minuteStep) * args.minuteStep),
			this.date = setDate(args.date),
			this.time = args.time,
			this.fdow = args.fdow, 
			tis = this
		runAF("onChange onSelect onTimeChange onFocus onBlur onClose".split(/\s+/), function(evname) {
            var evn = args[evname]
            evn instanceof Array || (evn = [evn]),
			tis.handlers[evname] = evn;
        })
		this.selection = new jscal.Selection(args.selection, args.selectionType, inputField, this),
		args.cont && getElementById(args.cont).appendChild(Create(this))//,
		//args.trigger && this.manageFields(args.trigger,args.inputField, args.dateFormat),//popup
		//dw(args)
	}
	
	function Create(tis) {
        var el = CreateElement("div"),
            els = tis.els = {},
            event = {
                mousedown: O(m, tis, true),
                mouseup: O(m, tis, false),
                mouseover: O(Hover, tis, true),
                mouseout: O(Hover, tis, false),
                keypress: O(w, tis)
            }
			tis.args.noScroll || (event[is_gecko ? "DOMMouseScroll" : "mousewheel"] = O(wheelCHTime, tis)),
			is_ie && (event.dblclick = event.mousedown, event.keydown = event.keypress),
			el.innerHTML = Calendar(tis)
			W(el.firstChild,
				function(tis) {
					var el = {
						"MDCalendar-topCont": "topCont",
						"MDCalendar-focusLink": "focusLink",
						"MDCalendar": "main",
						"MDCalendar-topBar": "topBar",
						"MDCalendar-title": "title",
						"MDCalendar-dayNames": "dayNames",
						"MDCalendar-body": "body",
						"MDCalendar-menu": "menu",
						"MDCalendar-menu-year": "yearInput",
						"MDCalendar-bottomBar": "bottomBar",
						"MDCalendar-tooltip": "tooltip",
						"MDCalendar-time-hour": "timeHour",
						"MDCalendar-time-minute": "timeMinute",
						"MDCalendar-time-am": "timeAM",
						"MDCalendar-navBtn MDCalendar-prevYear": "navPrevYear",
						"MDCalendar-navBtn MDCalendar-nextYear": "navNextYear",
						"MDCalendar-navBtn MDCalendar-prevMonth": "navPrevMonth",
						"MDCalendar-navBtn MDCalendar-nextMonth": "navNextMonth"
						}[tis.className]
					el && (els[el] = tis), 
					is_ie && tis.setAttribute("unselectable", "on")
				}
			),
			addEvent(els.main, event),
			addEvent([els.focusLink, els.yearInput], 
			tis._focusEvents = {
				focus: O(onFocus, tis),
				blur: O(setBluringTimeout, tis)
			}), 
			tis.moveTo(tis.date, false),
			tis.setTime(null, true)
		return els.topCont
    }
	
	function Calendar(tis) {//Calendar
        var str = ["<table class='MDCalendar-topCont' align='center' cellspacing='0' cellpadding='0'><tr><td><div class='MDCalendar'>", is_ie ? "<a class='MDCalendar-focusLink' href='#'></a>" : "<button class='MDCalendar-focusLink'></button>", "<div class='MDCalendar-topBar'><div dyc-type='nav' dyc-btn='-Y' dyc-cls='hover-navBtn,pressed-navBtn' ", "class='MDCalendar-navBtn MDCalendar-prevYear'><div></div></div><div dyc-type='nav' dyc-btn='+Y' dyc-cls='hover-navBtn,pressed-navBtn' ", "class='MDCalendar-navBtn MDCalendar-nextYear'><div></div></div><div dyc-type='nav' dyc-btn='-M' dyc-cls='hover-navBtn,pressed-navBtn' ", "class='MDCalendar-navBtn MDCalendar-prevMonth'><div></div></div><div dyc-type='nav' dyc-btn='+M' dyc-cls='hover-navBtn,pressed-navBtn' ", "class='MDCalendar-navBtn MDCalendar-nextMonth'><div></div></div><table class='MDCalendar-titleCont' align='center' cellspacing='0' cellpadding='0'><tr><td><div dyc-type='title' dyc-btn='menu' dyc-cls='hover-title,pressed-title' class='MDCalendar-title'><div unselectable='on'>"  + jscal.printDate(tis.date, tis.args.titleFormat)  + "</div></div></td></tr></table><div class='MDCalendar-dayNames'>",  weekNumber(tis),  "</div></div><div class='MDCalendar-body'></div>"];
		(tis.args.bottomBar || tis.args.showTime) && str.push("<div class='MDCalendar-bottomBar'>",  Today(tis),  "</div>"),
		str.push("<div class='MDCalendar-menu' style='display: none'>",  Menu(tis),  "</div><div class='MDCalendar-tooltip'></div></div></td></tr></table>")
		return str.join("")
    }

    function Menu(tis) {//i()
        var k,
		str = ["<table height='100%'", " align='center' cellspacing='0' cellpadding='0'", "><tr><td><table style='margin-top: 1.5em'", " align='center' cellspacing='0' cellpadding='0'", ">", "<tr><td colspan='3'><input dyc-btn='year' class='MDCalendar-menu-year' size='6' value='", 
		tis.date.getFullYear(), "' /></td></tr><tr><td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='today'>", _("goToday"), "</div></td></tr></table><p class='MDCalendar-menu-sep'>&nbsp;</p><table class='MDCalendar-menu-mtable'", " align='center' cellspacing='0' cellpadding='0'", ">"], 
		shortMN = _("smn")
		for (i = 0,j = str.length; 12 > i;) {
			str[j++] = "<tr>"
            for (k = 4; --k > 0;)
				str[j++] = "<td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='m" + i + "' class='MDCalendar-menu-month'>" + shortMN[i++] + "</div></td>"
            str[j++] = "</tr>"
        }
		str[j++] = "</table></td></tr></table>"
        return str.join("")
    }

    function weekNumber(tis) {//Calendar-weekNumber
        var e, n = ["<table align='center' cellspacing='0' cellpadding='0'><tr>"],
            a = 0
			tis.args.weekNumbers && n.push("<td><div class='MDCalendar-weekNumber'>", _("wk"), "</div></td>")
		for (; 7 > a;) 
			e = (a++ + tis.fdow) % 7,
			n.push("<td><div", _("weekend").indexOf(e) < 0 ? ">" : " class='MDCalendar-weekend'>", _("sdn")[e], "</div></td>")
			n.push("</tr></table>")
        return n.join("")
    }

    function Day(tis, date, fdow) {//Calendar-day
        var monthnow, str = [], i = 0 , wk, dow, datet, day, month, year, horizontal, vertical, dayt, montht, yeart, fulldate, selected, disabled
			date = date || tis.date, 
			fdow = fdow || tis.fdow, 
			date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0),
			monthnow = date.getMonth(), 
			wk = tis.args.weekNumbers, 
			date.setDate(1), 
			dow = (date.getDay() - fdow) % 7, 
			0 > dow && (dow += 7), 
			date.setDate(0 - dow), 
			date.setDate(date.getDate() + 1),
			datet = new Date, 
			day = datet.getDate(), 
			month = datet.getMonth(), 
			year = datet.getFullYear(),
			str[i++] = "<table class='MDCalendar-bodyTable'" + " align='center' cellspacing='0' cellpadding='0'" + ">"
			for (horizontal = 0; 6 > horizontal; ++horizontal) {
				str[i++] = "<tr class='MDCalendar-week", 
				0 == horizontal && (str[i++] = " MDCalendar-first-row"), 
				5 == horizontal && (str[i++] = " MDCalendar-last-row"),
				str[i++] = "'>",
				wk && (str[i++] = "<td class='MDCalendar-first-col'><div class='MDCalendar-weekNumber'>" + getWeekNumber(date) + "</div></td>") 
				for (vertical = 0; 7 > vertical; ++vertical)
					dayt = date.getDate(),
					montht = date.getMonth(),
					yeart = date.getFullYear(),
					fulldate = 1e4 * yeart + 100 * (montht + 1) + dayt,
					selected = tis.selection.isSelected(fulldate), 
					disabled = tis.isDisabled(date),
					str[i++] = "<td class='", 
					0 != vertical || wk || (str[i++] = " MDCalendar-first-col"), 
					0 == vertical && 0 == horizontal && (tis._firstDateVisible = fulldate),
					6 == vertical && (str[i++] = " MDCalendar-last-col", 
					5 == horizontal && (tis._lastDateVisible = fulldate)), 
					selected && (str[i++] = " MDCalendar-td-selected"), 
					str[i++] = "'><div dyc-type='date' unselectable='on' dyc-date='" + fulldate + "' ", 
					disabled && (str[i++] = "disabled='1' "), 
					str[i++] = "class='MDCalendar-day",
					_("weekend").indexOf(date.getDay()) < 0 || (str[i++] = " MDCalendar-weekend"), 
					montht != monthnow && (str[i++] = " MDCalendar-day-othermonth"),
					dayt == day && montht == month && yeart == year && (str[i++] = " MDCalendar-day-today"), 
					disabled && (str[i++] = " MDCalendar-day-disabled"), 
					selected && (str[i++] = " MDCalendar-day-selected"), 
					disabled = tis.args.dateInfo(date),
					disabled && disabled.klass && (str[i++] = " " + disabled.klass),
					str[i++] = "'>" + dayt + "</div></td>", 
					date = new Date(yeart, montht, dayt + 1, 12, 0, 0, 0)
				str[i++] = "</tr>"
			} 
		str[i++] = "</table>"
		return str.join("")
    }

    function Time(tis, e) {//print Calendar-time
        e.push("<table class='MDCalendar-time'" + " align='center' cellspacing='0' cellpadding='0'" + "><tr><td rowspan='2'><div dyc-type='time-hour' dyc-cls='hover-time,pressed-time' class='MDCalendar-time-hour'></div></td><td dyc-type='time-hour+' dyc-cls='hover-time,pressed-time' class='MDCalendar-time-up'></td><td rowspan='2' class='MDCalendar-time-sep'></td><td rowspan='2'><div dyc-type='time-min' dyc-cls='hover-time,pressed-time' class='MDCalendar-time-minute'></div></td><td dyc-type='time-min+' dyc-cls='hover-time,pressed-time' class='MDCalendar-time-up'></td>"),
		tis.args.showTime == 12 && e.push("<td rowspan='2' class='MDCalendar-time-sep'></td><td rowspan='2'><div class='MDCalendar-time-am' dyc-type='time-am' dyc-cls='hover-time,pressed-time'></div></td>"),
		e.push("</tr><tr><td dyc-type='time-hour-' dyc-cls='hover-time,pressed-time' class='MDCalendar-time-down'></td><td dyc-type='time-min-' dyc-cls='hover-time,pressed-time' class='MDCalendar-time-down'></td></tr></table>")
    }

    function Today(tis) {// print Today
        var n = [],
            a = tis.args
        n.push("<table", " align='center' cellspacing='0' cellpadding='0'", " style='width:100%'><tr>"),
		a.timePos == "left" && a.showTime && (n.push("<td>"), Time(tis, n), n.push("</td>")),
		a.bottomBar && (n.push("<td><table", " align='center' cellspacing='0' cellpadding='0'", "><tr><td><div dyc-btn='today' dyc-cls='hover-bottomBar-today,pressed-bottomBar-today' dyc-type='bottomBar-today' class='MDCalendar-bottomBar-today'>",
		_("today"), "</div></td></tr></table></td>")),
		a.timePos == "right" && a.showTime && (n.push("<td>"), Time(tis, n), n.push("</td>")), 
		n.push("</tr></table>")
		return n.join("")
    }
	
	function Title(tis) {//Title
        return "<div unselectable='on'>" + jscal.printDate(tis.date, tis.args.titleFormat) + "</div>"
    }

    function getWeekNumber(date) {
        var dow, ms
        return date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0),
			dow = date.getDay(), 
			date.setDate(date.getDate() - (dow + 6) % 7 + 3),// Nearest Thu
			ms = date.valueOf(),// GMT
			date.setMonth(0), 
			date.setDate(4), // Thu in Week 1
			Math.round((ms - date.valueOf()) / 6048e5) + 1
    }
	
    function getDayOfYear(date) {
        var e, time
        return now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0),
			then = new Date(date.getFullYear(), 0, 1, 12, 0, 0),
			time = now - then,
			Math.floor(time / 864e5)
    }
	
	function inputField() {// print inputField
        this.refresh(),
		this.inputField && (/input|textarea/i.test(this.inputField.tagName) ? this.inputField.value = this.selection.print(this.dateFormat) : this.inputField.innerHTML = this.selection.print(this.dateFormat)), 
		this.callHooks("onSelect", this, this.selection)
    }
	
	function argDiff(args,defargs, n, newArg){//E()
		var newArg = {}
        for (n in defargs) defargs.hasOwnProperty(n) && (newArg[n] = defargs[n])
        for (n in args) args.hasOwnProperty(n) && (newArg[n] = args[n])
		return newArg;
	}    
	
	function setDate(date) {//k()
        if (date) {
            if ("number" == typeof date) return jscal.intToDate(date)
            if (!(date instanceof Date)) {
                var dateSpl = date.split(/-/)
                return new Date(parseInt(dateSpl[0], 10), parseInt(dateSpl[1], 10) - 1, parseInt(dateSpl[2], 10), 12, 0, 0, 0)
            }
        }
        return date
    }    
	
	function getElementById(el) {
		"string" == typeof el && (el = document.getElementById(el))
        return el
    }
	
	function CreateElement(type, className, parent) {//CreateElement(type, parent)
        var el = null //el
        el = document.createElementNS ? document.createElementNS("http://www.w3.org/1999/xhtml", type) : document.createElement(type),
		className && (el.className = className),
		parent && parent.appendChild(el)
		return el
    }
	
	function onFocus() {//c()
        this._bluringTimeout && clearTimeout(this._bluringTimeout),
		this.focused = true, 
		P(this.els.main, "MDCalendar-focused"),
		this.callHooks("onFocus", this)
    }
	
	function onBlur() {//h()
        this.focused = false,
		Y(this.els.main, "MDCalendar-focused"),
		this._menuVisible && y(this, false), 
		this.args.cont || this.hide(), 
		this.callHooks("onBlur", this)
    }

    function setBluringTimeout() {//u()
        this._bluringTimeout = setTimeout(O(onBlur, this), 50)
    }
	
	function addEvent(el, evname, func, a) {//addEvent = function(el, evname, func) {
        var i
        if (el instanceof Array)
            for (i = el.length; --i >= 0;) 
				addEvent(el[i], evname, func, a)
        else if ("object" == typeof evname)
            for (i in evname) evname.hasOwnProperty(i) && addEvent(el, i, evname[i], func)
        else el.addEventListener ? el.addEventListener(evname, func, is_ie ? true : !!a) : el.attachEvent ? el.attachEvent("on" + evname, func) : el["on" + evname] = func
    }

    function removeEvent(el, evname, func, a) {//removeEvent = function(el, evname, func) {
        var i
        if (el instanceof Array)
            for (i = el.length; --i >= 0;) removeEvent(el[i], evname, func)
        else if ("object" == typeof evname)
            for (i in evname) evname.hasOwnProperty(i) && removeEvent(el, i, evname[i], func)
        else el.removeEventListener ? el.removeEventListener(evname, func, is_ie ? true : !!a) : el.detachEvent ? el.detachEvent("on" + evname, func) : el["on" + evname] = null
    }

    function stopEvent(ev) {//stopEvent = function(ev) {
        return ev = ev || window.event, is_ie ? (ev.cancelBubble = true, ev.returnValue = false) : (ev.preventDefault(), ev.stopPropagation()), false
    }
	
	function U(t, e) {
        null == e && (e = 0)
        var n, a, s
        try {
            n = Array.prototype.slice.call(t, e)
        } catch (i) {
            for (n = Array(t.length - e), a = e, s = 0; a < t.length; ++a, ++s) n[s] = t[a]
        }
        return n
    }

    function O(func, tis) {
        var n = U(arguments, 2)
        return void 0 == tis ? function() {return func.apply(this, n.concat(U(arguments)))} : function() {return func.apply(tis, n.concat(U(arguments)))}
    }

    function W(t, e) {
        if (!e(t))
            for (var n = t.firstChild; n; n = n.nextSibling) n.nodeType == 1 && W(n, e)
    }
	
	function runAF(args, func) {//q()
        for (var n = 0; n < args.length; ++n) func(args[n])
    }
	
	function dateDiff(t, e, n) {//H()
        var ty = t.getFullYear(),
            tm = t.getMonth(),
            td = t.getDate(),
            ey = e.getFullYear(),
            em = e.getMonth(),
            ed = e.getDate()
        return ey > ty ? -3 : ty > ey ? 3 : em > tm ? -2 : tm > em ? 2 : n ? 0 : ed > td ? -1 : td > ed ? 1 : 0
    }
	
	function m(e, n) {
        var dycType, timeOut, dycBtn, dTdycType, dycDate, selection, event, dTDycCls, u
        n = n || window.event, 
		dycType = getDycType(n),
		dycType && !dycType.getAttribute("disabled") && (
			dycBtn = dycType.getAttribute("dyc-btn"), 
			dTdycType = dycType.getAttribute("dyc-type"),
			dycDate = dycType.getAttribute("dyc-date"),
			selection = this.selection, 
			event = {
				mouseover: stopEvent,
				mousemove: stopEvent,
				mouseup: function() {
					var dycCls = dycType.getAttribute("dyc-cls")
					dycCls && Y(dycType, Split(dycCls, 1)), 
					clearTimeout(timeOut), 
					removeEvent(document, event, true),
					event = null
				}
			}, 
			e ? 
			(setTimeout(O(this.focus, this), 1), 
				dTDycCls = dycType.getAttribute("dyc-cls"),
				dTDycCls && P(dycType, Split(dTDycCls, 1)), 
				("menu" == dycBtn ? 
					this.toggleMenu() : 
					(dycType && /^[+-][MY]$/.test(dycBtn) ? 
						(chdate(this, dycBtn) ? 
							(u = O(function() {
								chdate(this, dycBtn, true) ? 
									timeOut = setTimeout(u, 40) : (event.mouseup(), chdate(this, dycBtn))
								}, this), 
								timeOut = setTimeout(u, 350), 
								addEvent(document, event, true)
							) : event.mouseup()
						) : 
						("year" == dycBtn ? 
							(this.els.yearInput.focus(), 
								this.els.yearInput.select()
							) : 
							("time-am" == dTdycType ? 
								addEvent(document, event, true) : 
								(/^time/.test(dTdycType) ? 
									(u = O(function(t) {
										chtime.call(this, t), 
										timeOut = setTimeout(u, 100)
										}, this, dTdycType), 
										chtime.call(this, dTdycType), 
										timeOut = setTimeout(u, 350),
										addEvent(document, event, true)
									) : 
									(dycDate && selection.type && 
										((selection.type == t.SEL_MULTIPLE ? 
												(n.shiftKey && this._selRangeStart ? 
													selection.selectRange(this._selRangeStart, dycDate) : 
													(n.ctrlKey || selection.isSelected(dycDate) || !this.args.multiCtrl || selection.clear(true),
														selection.set(dycDate, true),
														this._selRangeStart = dycDate
													)
												) : 
												(selection.set(dycDate), 
													this.moveTo(jscal.intToDate(dycDate), 2)
												)
											),
											DateDiv = this._getDateDiv(dycDate), 
											Hover.call(this, true, {target: DateDiv})
										), 
										addEvent(document, event, true)
									)
								)
							)
						)
					)
				), 
				is_ie && event && /dbl/i.test(n.type) && event.mouseup(),
				this.args.fixed || !/^(MDCalendar-(topBar|bottomBar|weekend|weekNumber|menu(-sep)?))?$/.test(DateDiv.className) || this.args.cont || 
				(event.mousemove = O(p, this),
				this._mouseDiff = z(n, getAbsolutePos(this.els.topCont)), 
				addEvent(document, event, true)
				)
			) : 
			("today" == dycBtn ? 
				(this._menuVisible || selection.type != jscal.SEL_SINGLE || selection.set(new Date), 
				this.moveTo(new Date, true), 
				y(this, false)
				) : 
				(/^m([0-9]+)/.test(dycBtn) ? 
					(dycDate = new Date(this.date), 
					dycDate.setDate(1),
					dycDate.setMonth(RegExp.$1), 
					dycDate.setFullYear(this._getInputYear()),
					this.moveTo(dycDate, true), 
					y(this, false)
					) : 
					("time-am" == dTdycType && this.setHours(this.getHours() + 12),
					is_ie || stopEvent(n)
					)
				)
			)
		)
    }
	
	function getAbsolutePos(el) {//G()
        var BCR, osl = 0, ost = 0
        if (el.getBoundingClientRect) return BCR = el.getBoundingClientRect(), {
            x: BCR.left - document.documentElement.clientLeft + document.body.scrollLeft,
            y: BCR.top - document.documentElement.clientTop + document.body.scrollTop
        }
        do osl += el.offsetLeft - el.scrollLeft,
			ost += el.offsetTop - el.scrollTop
        while (el = el.offsetParent)
        return {
            x: osl,
            y: ost
        }
    }

    function z(t, e) {
        var n = is_ie ? t.clientX + document.body.scrollLeft : t.pageX,
            a = is_ie ? t.clientY + document.body.scrollTop : t.pageY
        return e && (n -= e.x, a -= e.y), {
            x: n,
            y: a
        }
    }
	
	function getDycType(t) {// get dyc-type
        for (var e = t.target || t.srcElement, n = e; e && e.getAttribute && !e.getAttribute("dyc-type");) e = e.parentNode
        return e.getAttribute && e || n
    }

    function Split(t, e) {
        return "MDCalendar-" + t.split(/,/)[e]
    }

    function Hover(t, e) {// D()
        var DycType, dTdycType, dycCls
        e = e || window.event, 
		DycType = getDycType(e), 
		DycType && (
			dTdycType = DycType.getAttribute("dyc-type"),
			dTdycType && !DycType.getAttribute("disabled") && (
				t && this._bodyAnim && "date" == dTdycType || (
					dycCls = DycType.getAttribute("dyc-cls"), 
					dycCls = dycCls ? Split(dycCls, 0) : "MDCalendar-hover-" + dTdycType, 
					("date" != dTdycType || this.selection.type) && R(t, DycType, dycCls), 
					"date" == dTdycType && (
						R(t, DycType.parentNode.parentNode, "MDCalendar-hover-week"),
						this._showTooltip(DycType.getAttribute("dyc-date"))
					),
					/^time-hour/.test(dTdycType) && R(t, this.els.timeHour, "MDCalendar-hover-time"),
					/^time-min/.test(dTdycType) && R(t, this.els.timeMinute, "MDCalendar-hover-time"), 
					Y(this._getDateDiv(this._lastHoverDate), "MDCalendar-hover-date"),
					this._lastHoverDate = null
				)
			)
		),
		t || this._showTooltip()
    }

    function wheelCHTime(event) {// b()
        var dycType, dycBtn, dycType, wheelStep
        if (event = event || window.event, dycType = getDycType(event)){
			dycBtn = dycType.getAttribute("dyc-btn"), 
			dycType = dycType.getAttribute("dyc-type"), 
			wheelStep = event.wheelDelta ? event.wheelDelta / 120 : -event.detail / 3,
			wheelStep = 0 > wheelStep ? -1 : wheelStep > 0 ? 1 : 0,
			this.args.reverseWheel && (wheelStep = -wheelStep)
            if (/^(time-(hour|min))/.test(dycType)) {
					switch (RegExp.$1) {
						case "time-hour":
							this.setHours(this.getHours() + wheelStep)
							break
						case "time-min":
							this.setMinutes(this.getMinutes() + this.args.minuteStep * wheelStep)
					}
					stopEvent(event)
            } else 
				/Y/i.test(dycBtn) && (wheelStep *= 2),
				chdate(this, -wheelStep), 
				stopEvent(event)
		}
    }

    function chtime(dycType) { // d()
        switch (dycType) {
            case "time-hour+":
                this.setHours(this.getHours() + 1)
                break
            case "time-hour-":
                this.setHours(this.getHours() - 1)
                break
            case "time-min+":
                this.setMinutes(this.getMinutes() + this.args.minuteStep)
                break
            case "time-min-":
                this.setMinutes(this.getMinutes() - this.args.minuteStep)
                break
            default:
                return
        }
    }

    function chdate(tis, dycBtn, anim) { // f()
        this._bodyAnim && this._bodyAnim.stop()
        if (0 != dycBtn){
			var data = new Date(tis.date)
			data.setDate(1)
			switch ( dycBtn) {
				case "-Y":
				case -2:
					data.setFullYear(data.getFullYear() - 1)
					break
				case "+Y":
				case 2:
					data.setFullYear(data.getFullYear() + 1)
					break
				case "-M":
				case -1:
					data.setMonth(data.getMonth() - 1)
					break
				case "+M":
				case 1:
					data.setMonth(data.getMonth() + 1)
			}
		}else 
			data = new Date
        return tis.moveTo(data, !anim)
    }
	
	function w(e) {
        var target, dycBtn, keyCode, charCode, r, date, yearInput, selection, MN, monthName, d, m, p
        if (!this._menuAnim) {
			e = e || window.event, 
			target = e.target || e.srcElement,
			dycBtn = target.getAttribute("dyc-btn"),
			keyCode = e.keyCode, 
			charCode = e.charCode || keyCode,
			r = ee[keyCode]
            if ("year" == dycBtn && 13 == keyCode) {
				date = new Date(this.date), 
				date.setDate(1), 
				date.setFullYear(this._getInputYear()), 
				this.moveTo(date, true), 
				y(this, false)
				return stopEvent(e)
			}
            if (this._menuVisible) {
                if (27 == keyCode){
					y(this, false)
					return stopEvent(e)
				}
            } else {
				e.ctrlKey || (r = null),
				null != r || e.ctrlKey || (r = ne[keyCode]), 
				36 == keyCode && (r = 0)
                if (null != r){ 
					chdate(this, r)
					return stopEvent(e)
				}
				charCode = String.fromCharCode(charCode).toLowerCase(),
				yearInput = this.els.yearInput,
				selection = this.selection
                if ( " " == charCode){ 
					y(this, true),
					this.focus(), 
					yearInput.focus(), 
					yearInput.select() 
					return stopEvent(e)
				}
                if (charCode >= "0" && "9" >= charCode){ 
					y(this, true), 
					this.focus(),
					yearInput.value = charCode,
					yearInput.focus() 
					return stopEvent(e)
				}
				monthName = _("mn"),
				d = e.shiftKey ? -1 : this.date.getMonth()
                for (m = 0; ++m < 12;){
					MN = monthName[(d + m) % 12].toLowerCase()
                    if ( MN.indexOf(charCode) == 0){ 
						date = new Date(this.date),
						date.setDate(1), 
						date.setMonth((d + m) % 12),
						this.moveTo(date, true) 
						return stopEvent(e)
					}
				}
                if (keyCode >= 37 && 40 >= keyCode) {
					date = this._lastHoverDate, date || selection.isEmpty() || (
						date = 39 > keyCode ? selection.getFirstDate() : selection.getLastDate(),
						(date < this._firstDateVisible || date > this._lastDateVisible) && (date = null)
					)
                    if ( date) {
						p = date, 
						date = jscal.intToDate(date)
                        for (d = 100; d-- > 0;) {
                            switch (keyCode) {
                                case 37:
                                    date.setDate(date.getDate() - 1)
                                    break
                                case 38:
                                    date.setDate(date.getDate() - 7)
                                    break
                                case 39:
                                    date.setDate(date.getDate() + 1)
                                    break
                                case 40:
                                    date.setDate(date.getDate() + 7)
                            }
                            if (!this.isDisabled(date)) break
                        }
                        date = jscal.dateToInt(date),
						(date < this._firstDateVisible || date > this._lastDateVisible) && this.moveTo(date)
                    } else
						date = 39 > keyCode ? this._lastDateVisible : this._firstDateVisible
					Y(this._getDateDiv(p), P(this._getDateDiv(date), "MDCalendar-hover-date")),
					this._lastHoverDate = date
                    return stopEvent(e)
                }
                if (13 == keyCode && this._lastHoverDate) {
					selection.type == jscal.SEL_MULTIPLE && (e.shiftKey || e.ctrlKey) ? (
						e.shiftKey && this._selRangeStart && (
							selection.clear(true), 
							selection.selectRange(this._selRangeStart, this._lastHoverDate)
						),
						e.ctrlKey && selection.set(this._selRangeStart = this._lastHoverDate, true)
					) : selection.reset(this._selRangeStart = this._lastHoverDate)
					return stopEvent(e)
				}
                27 != keyCode || this.args.cont || this.hide()
            }
        }
    }
	
	function y(tis, e) {// show menu
        var menu, offsetHeight
        tis._menuVisible = e,
		R(e, tis.els.title, "MDCalendar-pressed-title"),
		menu = tis.els.menu,
		is_ie6 && (menu.style.height = tis.els.main.offsetHeight + "px"),
		tis.args.animation ? (
			tis._menuAnim && tis._menuAnim.stop(),
			offsetHeight = tis.els.main.offsetHeight, 
			is_ie6 && (menu.style.width = tis.els.topBar.offsetWidth + "px"), 
			e && (menu.firstChild.style.marginTop = -offsetHeight + "px", tis.args.opacity > 0 && setOpacity(menu, 0), styledisplay(menu, true)), 
			tis._menuAnim = bodyanimation({
				onUpdate: function(s, i) {
					menu.firstChild.style.marginTop = i(ae.accel_b(s), -offsetHeight, 0, !e) + "px",
					tis.args.opacity > 0 && setOpacity(menu, i(ae.accel_b(s), 0, .85, !e))
				},
				onStop: function() {
					tis.args.opacity > 0 && setOpacity(menu, .85),
					menu.firstChild.style.marginTop = "",
					tis._menuAnim = null, 
					e || (styledisplay(menu, false), 
					tis.focused && tis.focus())
				}
			})
		) : (
			styledisplay(menu, e),
			tis.focused && tis.focus()
		)
    }
	
	function Y(t, e, n) {
        if (t) {
            var a,
			s = t.className.replace(/^\s+|\s+$/, "").split(/\x20/),
                i = []
            for (a = s.length; a > 0;) s[--a] != e && i.push(s[a])
            n && i.push(n),
			t.className = i.join(" ")
        }
        return n
    }

    function P(t, e) {
        return Y(t, e, e)
    }

    function R(t, e, n) {
        if (e instanceof Array)
            for (var a = e.length; --a >= 0;) R(t, e[a], n)
        else Y(e, n, t ? n : null)
        return t
    }
	
	function bodyanimation(args, e, n) {//animation
        function map(t, e, n, a) {
            return a ? n + t * (e - n) : e + t * (n - e)
        }

        function start() {
            e && stop(), 
			n = 0,
			e = setInterval(update, 1e3 / args.fps)
        }

        function stop() {
            e && (clearInterval(e), e = null),
			args.onStop(n / args.len, map)
        }

        function update() {
            var e = args.len
            args.onUpdate(n / e, map),
			n == e && stop(),
			++n
        }
        args = argDiff(args, {
            fps: 50,
            len: 15,
            onUpdate: Function(),
            onStop: Function()
        }), 
		is_ie && (args.len = Math.round(t.len / 2)), 
		start()
		return {
            start: start,
            stop: stop,
            update: update,
            args: args,
            map: map
        }
    }

    function setOpacity(el, value) {// set opacity
		"" === value ? 
			is_ie ? el.style.filter = "" : el.style.opacity = "" : 
			null != value ?
				is_ie ? el.style.filter = "alpha(opacity=" + 100 * value + ")" : el.style.opacity = value : 
				is_ie ? /alpha\(opacity=([0-9.])+\)/.test(el.style.opacity) && (value = parseFloat(RegExp.$1) / 100) : value = parseFloat(el.style.opacity)
        return value
    }
	
	jscal.prototype.moveTo = function(date, animation) {//date , animation
        var a, datedif, args, min, max, body, el, firstChild, u, ddbool, fcoffsetTL, elstyle, boffsetHW, cloneNode, cnstyle,/*  v, */ tis = this
			date = setDate(date),
			datedif = dateDiff(date, tis.date, true),
			args = tis.args,
			min = args.min && dateDiff(date, args.min), 
			max = args.max && dateDiff(date, args.max), 
			args.animation || (animation = false), 
			R(null != min && 1 >= min,[tis.els.navPrevMonth, tis.els.navPrevYear], "MDCalendar-navDisabled"),
			R(null != max && max >= -1, [tis.els.navNextMonth, tis.els.navNextYear], "MDCalendar-navDisabled"), 
			-1 > min && (date = args.min, a = 1, datedif = 0),
			max > 1 && (date = args.max, a = 2, datedif = 0),
			tis.date = date, 
			tis.refresh(!!animation),
			tis.callHooks("onChange", tis, date, animation), 
		 	!animation || 0 == datedif && 2 == animation || (
				tis._bodyAnim && tis._bodyAnim.stop(),
				body = tis.els.body,
				el = CreateElement("div", "MDCalendar-animBody-" + te[datedif], body),
				firstChild = body.firstChild, 
				setOpacity(firstChild) || .7, 
				(u = a ? 
					ae.brakes : 
					(0 == datedif ?
						ae.shake : ae.accel_ab2
					)
				),
				ddbool = datedif * datedif > 4, 
				fcoffsetTL = ddbool ? firstChild.offsetTop : firstChild.offsetLeft, 
				elstyle = el.style, 
				boffsetHW = ddbool ? body.offsetHeight : body.offsetWidth, 
				0 > datedif ? boffsetHW += fcoffsetTL : datedif > 0 ? boffsetHW = fcoffsetTL - boffsetHW : (boffsetHW = Math.round(boffsetHW / 7), 2 == a && (boffsetHW = -boffsetHW)), 
				a || 0 == datedif || (cloneNode = el.cloneNode(true),
				cnstyle = cloneNode.style, 
				//v = 2 * boffsetHW, 
				cloneNode.appendChild(firstChild.cloneNode(true)), 
				cnstyle[ddbool ? "marginTop" : "marginLeft"] = boffsetHW + "px", 
				body.appendChild(cloneNode)), 
				firstChild.style.visibility = "hidden",
				el.innerHTML = Day(tis), 
				tis._bodyAnim = bodyanimation({
				onUpdate: function(t, e) {
					var n, i = u(t)
					cloneNode && (n = e(i, boffsetHW, 2 * boffsetHW) + "px"), a ? elstyle[ddbool ? "marginTop" : "marginLeft"] = e(i, boffsetHW, 0) + "px" : ((ddbool || 0 == datedif) && (elstyle.marginTop = e(0 == datedif ? u(t * t) : i, 0, boffsetHW) + "px", 0 != datedif && (cnstyle.marginTop = n)), ddbool && 0 != datedif || (elstyle.marginLeft = e(i, 0, boffsetHW) + "px", 0 != datedif && (cnstyle.marginLeft = n))), tis.args.opacity > 2 && cloneNode && (setOpacity(cloneNode, 1 - i), setOpacity(el, i))
				},
				onStop: function() {
					body.innerHTML = Day(tis, date),
					tis._bodyAnim = null
				}
			})
		),
		tis._lastHoverDate = null
		return min >= -1 && 1 >= max
    }
	
	jscal.prototype.isDisabled = function(date) {
        var args = this.args
        return args.min && dateDiff(date, args.min) < 0 || args.max && dateDiff(date, args.max) > 0 || args.disabled(date)
    }
	
	jscal.prototype.toggleMenu = function() {
        y(this, !this._menuVisible)
    }
	
	jscal.prototype.refresh = function(noBody) {
        var els = this.els
        noBody || (els.body.innerHTML = Day(this)), 
		els.title.innerHTML = Title(this), 
		els.yearInput.value = this.date.getFullYear()
    }
	/* 
	jscal.prototype.manageFields = function(trigger, inputField, dateFormat) {//trigger, inputField, dateFormat
        var a = this
        inputField = getElementById(inputField),
		trigger = getElementById(trigger),
		/^button$/i.test(trigger.tagName) && trigger.setAttribute("type", "button"),
		addEvent(trigger, "click", function(s) {
            return a.popupForField(trigger, inputField, dateFormat), 
				stopEvent(s)
        })
    }
	
	jscal.prototype.popupForField = function(trigger, inputField, dateFormat) {//trigger, inputField, dateFormat
        var s, i, r, o, l = this
        inputField = getElementById(inputField),
		trigger = getElementById(trigger),
		l.inputField = inputField, 
		l.dateFormat = dateFormat,
		l.selection.type == t.SEL_SINGLE && (s = /input|textarea/i.test(inputField.tagName) ? inputField.value : inputField.innerText || inputField.textContent,
			s && (i = /(^|[^%])%[bBmo]/.exec(dateFormat),
			r = /(^|[^%])%[de]/.exec(dateFormat),
			i && r && (o = i.index < r.index),
			s = Calendar.parseDate(s, o), 
			s && (l.selection.set(s, false, true), 
			l.args.showTime && (l.setHours(s.getHours()), l.setMinutes(s.getMinutes())), 
			l.moveTo(s)))),
		l.popup(trigger)
    } */
	
	jscal.Selection = function(selection, selectionType, inputField, tis) {
        this.type = selectionType,
		this.sel = selection instanceof Array ? selection : [selection],
		this.onChange = O(inputField, tis), 
		this.cal = tis
    }
	
	jscal.Selection.prototype = {
        get: function() {
            return this.type == jscal.SEL_SINGLE ? this.sel[0] : this.sel
        },
        isEmpty: function() {
            return this.sel.length == 0
        },
        set: function(e, n, a) {//arg, toggle)
            var type = this.type == jscal.SEL_SINGLE
            e instanceof Array ? 
				(
					this.sel = e,
					this.normalize(), 
					a || this.onChange(this)
				) : (
					e = jscal.dateToInt(e),
					type || !this.isSelected(e) ? 
					(
						type ? this.sel = [e] : this.sel.splice(this.findInsertPos(e), 0, e),
						this.normalize(), 
						a || this.onChange(this)
					) : n && this.unselect(e, a)
				)
        },
        reset: function() {//arg, toggle)
            this.sel = [], 
			this.set.apply(this, arguments)
        },
        countDays: function() {
			var subSel, dateo, datet, count = 0, sel = this.sel
            for (var i = sel.length; --i >= 0;)
			subSel = sel[i], 
			subSel instanceof Array && (
				dateo = jscal.intToDate(subSel[0]),
				datet = jscal.intToDate(subSel[1]),
				count += Math.round(Math.abs(datet.getTime() - dateo.getTime()) / 864e5)
			), 
			++count
            return count
        },
        unselect: function(date, e) {//date)
            var bool, a, sel, i, datet, Date, Datet
            date = jscal.dateToInt(date), 
			bool = false, 
			sel = this.sel
			for (i = sel.length; --i >= 0;) 
				a = sel[i], 
				a instanceof Array ? date < a[0] || date > a[1] || 
				(
					datet = jscal.intToDate(date), 
					Date = datet.getDate(),
					date == a[0] ? 
						(
							datet.setDate(Date + 1), 
							a[0] = jscal.dateToInt(datet),
							bool = true
						) : date == a[1] ? 
						(
							datet.setDate(Date - 1), 
							a[1] = jscal.dateToInt(datet),
							bool = true
						) : (
							Datet = new Date(datet), 
							Datet.setDate(Date + 1),
							datet.setDate(Date - 1), 
							sel.splice(i + 1, 0, [jscal.dateToInt(Datet), a[1]]), 
							a[1] = jscal.dateToInt(datet), 
							bool = true
						)
					) : date == a && (sel.splice(i, 1), bool = true)
            bool && (this.normalize(), e || this.onChange(this))
        },
        normalize: function() {
			var t, e, sel, a, s, i, r
			this.sel = this.sel.sort(function(t, e) {
                    return t instanceof Array && (t = t[0]), e instanceof Array && (e = e[0]), t - e
            })
			sel = this.sel
            for(a = sel.length; --a >= 0;) {
                if(t = sel[a], t instanceof Array) {
                    if(t[0] > t[1]) {
                        sel.splice(a, 1)
                        continue
                    }
                    t[0] == t[1] && (t = sel[a] = t[0])
                }
                e && (
					s = e, 
					i = t instanceof Array ? t[1] : t,
					i = jscal.intToDate(i),
					i.setDate(i.getDate() + 1),
					i = jscal.dateToInt(i),
					s > i || 
					(
						r = sel[a + 1],
						t instanceof Array && r instanceof Array ? 
						(
							t[1] = r[1],
							sel.splice(a + 1, 1)
						) : t instanceof Array ? 
						(
							t[1] = e,
							sel.splice(a + 1, 1)
						) : r instanceof Array ? 
						(
							r[0] = t, 
							sel.splice(a, 1)
						) : (
							sel[a] = [t, r],
							sel.splice(a + 1, 1)
						)
					)
				), 
				e = t instanceof Array ? t[0] : t
            }
        },
        findInsertPos: function(t) {
			var e, sel = this.sel, i
            for ( i = sel.length; --i >= 0 && (e = sel[i], e instanceof Array && (e = e[0]), t < e););
            return i + 1
        },
        clear: function(nohooks) {//nohooks)
            this.sel = [],
			nohooks || this.onChange(this)
        },
        selectRange: function(start_date, end_date) {//start_date, end_date)
            var tmp, checkRange
			start_date = jscal.dateToInt(start_date),
			end_date = jscal.dateToInt(end_date), 
			start_date > end_date && (tmp = start_date, start_date = end_date, end_date = tmp), 
			checkRange = this.cal.args.checkRange 
            if (!checkRange) return this._do_selectRange(start_date, end_date)
            try {
                runAF(new jscal.Selection([[start_date, end_date]], jscal.SEL_MULTIPLE, Function()).getDates(), O(function(t) {
                    if (this.isDisabled(t)) throw checkRange instanceof Function && checkRange(t, this), "OUT"
					}, this.cal)
				),
				this._do_selectRange(start_date, end_date)
            } catch (i) {}
        },
        _do_selectRange: function(start_date, end_date) {
            this.sel.push([start_date, end_date]), 
			this.normalize(), 
			this.onChange(this)
        },
        isSelected: function(t) {
			var sel,i
            for ( i = this.sel.length; --i >= 0;){
				sel = this.sel[i]
                if ( sel instanceof Array && t >= sel[0] && t <= sel[1] || t == sel)
					return true
			}
            return false
        },
        getFirstDate: function() {
            var sel = this.sel[0]
			sel && sel instanceof Array && (sel = sel[0])
            return sel
        },
        getLastDate: function() {
            if (this.sel.length > 0) {
                var sel = this.sel[this.sel.length - 1]
				sel && sel instanceof Array && (sel = sel[1])
                return sel
            }
        },
        print: function(format, separator) {//format, separator)
            var sel, 
				str = [],
                Hours = this.cal.getHours(),
                Minutes = this.cal.getMinutes()
				separator || (separator = " -> ")
            for (var i = 0; i < this.sel.length;) 
				sel = this.sel[i++], 
				sel instanceof Array ? 
					str.push(jscal.printDate(jscal.intToDate(sel[0], Hours, Minutes), format) + separator + jscal.printDate(jscal.intToDate(sel[1], Hours, Minutes), format)) : 
					str.push(jscal.printDate(jscal.intToDate(sel, Hours, Minutes), format))
            return str
        },
        getDates: function(str) {
			var date, sel, string = []
            for (var i = 0; i < this.sel.length;) {
				sel = this.sel[i++]
                if ( sel instanceof Array){
					date = jscal.intToDate(sel[0])
                    for (sel = sel[1]; jscal.dateToInt(date) < sel;)
						string.push(str ? jscal.printDate(date, str) : new Date(date)),
						date.setDate(date.getDate() + 1)
                } else 
					date = jscal.intToDate(sel)
                string.push(str ? jscal.printDate(date, str) : date)
            }
            return string
        }
    }
	
	jscal.prototype.focus = function() {
        try {
            this.els[this._menuVisible ? "yearInput" : "focusLink"].focus()
        } catch (t) {}
        onFocus.call(this)
    }
	
	jscal.prototype.blur = function() {
        this.els.focusLink.blur(), 
		this.els.yearInput.blur(), 
		onBlur.call(this)
    }
	
	jscal.prototype.callHooks = function(evname) {
		var e = U(arguments, 1), 
		n = this.handlers[evname]
        for (a = 0; a < n.length; ++a) n[a].apply(this, e)
    }
	
	jscal.prototype.addEventListener = function(evname, func) {
        this.handlers[evname].push(func)
    }
	
	jscal.prototype.removeEventListener = function(evname, func) {
		var n = this.handlers[evname]
        for (a = n.length; --a >= 0;) n[a] === func && n.splice(a, 1)
    }
	
	jscal.prototype.getTime = function() {
        return this.time
    }
	
	jscal.prototype.getHours = function() {
        return Math.floor(this.time / 100)
    }
	
	jscal.prototype.getMinutes = function() {
        return this.time % 100
    }
	
	jscal.prototype.setHours = function(H) {
        0 > H && (H += 24), 
		this.setTime(100 * (H % 24) + this.time % 100)
    }
	
	jscal.prototype.setMinutes = function(M) {
        0 > M && (M += 60),
		M = Math.floor(M / this.args.minuteStep) * this.args.minuteStep,
		this.setTime(100 * this.getHours() + M % 60)
    }
	
	jscal.prototype.setTime = function(time, nohooks) {//time, [ nohooks ]
        var Hours, Minutes, inputField, selection, print
        this.args.showTime && (time = null != time ? time : this.time,
		this.time = time, 
		Hours = this.getHours(), 
		Minutes = this.getMinutes(), 
		this.args.showTime == 12 && (0 == Hours && (Hours = 12),
		Hours > 12 && (Hours -= 12),
		this.els.timeAM.innerHTML = _(12 > Hours ? "AM" : "PM")), 
		10 > Hours && (Hours = "0" + Hours), 
		10 > Minutes && (Minutes = "0" + Minutes), 
		this.els.timeHour.innerHTML = Hours, 
		this.els.timeMinute.innerHTML = Minutes, 
		nohooks || (this.callHooks("onTimeChange", this, time), 
		inputField = this.inputField,
		selection = this.selection, 
		inputField && (print = selection.print(this.dateFormat),
		/input|textarea/i.test(inputField.tagName) ? inputField.value = print : inputField.innerHTML = print)))
    }
	
	jscal.prototype._getInputYear = function() {
        var year = parseInt(this.els.yearInput.value, 10)
        return isNaN(year) && (year = this.date.getFullYear()), year
    }
	
	jscal.prototype._showTooltip = function(t) {
        var dateInfo, str = "",
            tooltip = this.els.tooltip
        t && (t = jscal.intToDate(t), 
		dateInfo = this.args.dateInfo(t),
		dateInfo && dateInfo.tooltip && (str = "<div class='MDCalendar-tooltipCont'>" + jscal.printDate(t, dateInfo.tooltip) + "</div>")), 
		tooltip.innerHTML = str
    }
	
	jscal.prototype._getDateDiv = function(t) {
        var e = null
        if (t) try {
            W(this.els.body, function(n) {
                if (n.getAttribute("dyc-date") == t) throw e = n
            })
        } catch (n) {}
        return e
    }
	
	jscal.prototype.setLanguage = function(code) {
		 var lang = jscal.lang[code]
        lang && (jscal.lang._ = lang),
        lang && (this.fdow = lang.data.fdow, this.redraw())
    }
	
	jscal.intToDate = function(t, e, n, a, s) {//A()
        var i, r
        return t instanceof Date || (t = parseInt(t, 10),
		i = Math.floor(t / 1e4),
		t %= 1e4,
		r = Math.floor(t / 100), 
		t %= 100, 
		t = new Date(i, r - 1, t, null == e ? 12 : e, null == n ? 0 : n, null == a ? 0 : a, null == s ? 0 : s)), t
    }
	
	jscal.dateToInt = function(date) {//L()
        return date instanceof Date ? 1e4 * date.getFullYear() + 100 * (date.getMonth() + 1) + date.getDate() : "string" == typeof date ? parseInt(date, 10) : date
    }
	
	jscal.printDate = function(date, str) {//S()
        var n, m = date.getMonth(),
            d = date.getDate(),
            y = date.getFullYear(),
            wk = getWeekNumber(date),
            dow = date.getDay(),
            h = date.getHours(),
            pm = h >= 12,
            ir = pm ? h - 12 : h,
            doy = getDayOfYear(date),
            i = date.getMinutes(),
            s = date.getSeconds(),
            reg = /%./g
			0 === ir && (ir = 12),
			n = {
            "%a": _("sdn")[dow],
            "%A": _("dn")[dow],
            "%b": _("smn")[m],
            "%B": _("mn")[m],
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
        }
		return str.replace(reg, function(t) {
            return n.hasOwnProperty(t) ? n[t] : t
        })
    }
	
	jscal.Language = function(shortName, name, data) {
			jscal.lang._ = jscal.lang[shortName] = {
				name: name,
				data: argDiff(data,{
					fdow: 1,                // first day of week for this locale; 0 = Sunday, 1 = Monday, etc.
					goToday: "Go Today",
					today: "Today",         // appears in bottom bar
					wk: "wk",
					weekend: "0,6",         // 0 = Sunday, 1 = Monday, etc.
					AM: "am",
					PM: "pm",
					mn : [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
					smn : [ "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec" ],
					dn : [ "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday" ],
					sdn : [ "Su","Mo","Tu","We","Th","Fr","Sa","Su" ]
				}) 
			}
	}
	
	jscal.formatString = function(str, prop) {//M()
        return str.replace(/\$\{([^:\}]+)(:[^\}]+)?\}/g, function(str, n, a) {
            var s, i = prop[n]
            return a && (s = a.substr(1).split(/\s*\|\s*/), i = (i < s.length ? s[i] : s[s.length - 1]).replace(/##?/g, function(str) {
                return str.length == 2 ? "#" : i
            })), i
        })
    }

    function _(t, e) {// _()
        var n = jscal.lang._.data[t]
		e && "string" == typeof n && (n = jscal.formatString(n, e))
        return n
    }
	
	jscal.setup = function(args) {
        return new jscal(args)
    }
	
	
return jscal
}();


