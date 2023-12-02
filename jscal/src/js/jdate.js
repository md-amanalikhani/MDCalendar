
/**
	* In The Name Of God
	* @package JDate
    * @author   MohammaD (MD) Amanalikhani
	* @link    http://md-amanalikhani.github.io | http://md.akhi.ir
	* @copyright   Copyright (C) 2015 - 2020 Open Source Matters,Inc. All right reserved.
	* @license http://www.php.net/license/3_0.txt  PHP License 3.0
	* @version Release: 1.0.0
	*/	
// to test a function and get back its return
// function printElapsedTime(nStartTime) {
     // var nEndTime = Date.now();
  // console.log('Elapsed time: ' + String(nEndTime - nStartTime) + ' milliseconds');
  // return nEndTime - nStartTime + ' milliseconds';
// }
// nStartTime = Date.now();


  function dw(obj) {
    var out = "\n";
	if("object" == typeof obj || "array" == typeof obj)
		for (var i in obj) {
			out += i + " : " + obj[i] +"\n";
		}
	else
		out += obj ;
    var pre = document.createElement('pre');
    pre.innerHTML = '<pre>'+out+ "</pre>\n";
    document.write(pre.innerHTML);
}




JDateCultureInfo = {
	/* Culture Name */
    name: "fa_IR",
    englishName: "Persian (Iran)",
    nativeName: "فارسى (ايران)",

    /* Day Name Strings */
    dayNames: ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهار شنبه", "پنجشنبه", "جمعه"],
    abbreviatedDayNames: ['شـ','یـ‍‍‎‎‍','د','سـ','چـ','پـ','جـ‍‍‎‎‍'],

    /* Month Name Strings */
    monthNames: ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'],
    abbreviatedMonthNames: ['فرو','ارد','خرد','تير','امر','شهر','مهر','آبا','آذر','دي','بهمـ','اسفـ'],

	/* AM/PM Designators */
    amDesignator: "ق.ظ",
    pmDesignator: "ب.ظ",

    firstDayOfWeek: 0,
    twoDigitYearMax: 3500000,

    /**
     * The dateElementOrder is based on the order of the
     * format specifiers in the formatPatterns.DatePattern.
     *
     * Example:
     <pre>
     shortDatePattern    dateElementOrder
     ------------------  ----------------
     "M/d/yyyy"          "mdy"
     "dd/MM/yyyy"        "dmy"
     "yyyy-MM-dd"        "ymd"
     </pre>
     *
     * The correct dateElementOrder is required by the parser to
     * determine the expected order of the date elements in the
     * string being parsed.
     */
    dateElementOrder: "ymd",

    /* Standard date and time format patterns */
    formatPatterns: {
        shortDate: "yyyy/M/d",
        longDate: "dddd, MMMM dd, yyyy",
        shortTime: "hh:mm tt",
        longTime: "hh:mm:ss tt",
        fullDateTime: "dddd, MMMM dd, yyyy hh:mm:ss tt",
        sortableDateTime: "yyyy-MM-ddTHH:mm:ss",
        universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ",
        rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT",
        monthDay: "MMMM dd",
        yearMonth: "MMMM, yyyy",
        toString: "ddd MMM dd yyyy TS",
        toISOString: "yyyy-MM-ddTHH:ii:ss.lZ",
        toDateString: "dddd MMMM dd yyyy",
        toUTCString: "dddd, dd MMMM yyyy HH:ii:ss GMT"
    },

    /**
     * NOTE: If a string format is not parsing correctly, but
     * you would expect it parse, the problem likely lies below.
     *
     * The following regex patterns control most of the string matching
     * within the parser.
     *
     * The Month name and Day name patterns were automatically generated
     * and in general should be (mostly) correct.
     *
     * Beyond the month and day name patterns are natural language strings.
     * Example: "next", "today", "months"
     *
     * These natural language string may NOT be correct for this culture.
     * If they are not correct, please translate and edit this file
     * providing the correct regular expression pattern.
     *
     * If you modify this file, please post your revised CultureInfo file
     * to the Datejs Forum located at http://www.datejs.com/forums/.
     *
     * Please mark the subject of the post with [CultureInfo]. Example:
     *    Subject: [CultureInfo] Translated "da-DK" Danish(Denmark)
     *
     * We will add the modified patterns to the master source files.
     *
     * As well, please review the list of "Future Strings" section below.
     */
    regexPatterns: {
        jan: /^ژانویه/i,
        feb: /^فوریه/i,
        mar: /^مارس/i,
        apr: /^آوریل/i,
        may: /^مه/i,
        jun: /^ژوئیه/i,
        jul: /^ژولای/i,
        aug: /^آگوست/i,
        sep: /^سپتامبر/i,
        oct: /^اکتبر/i,
        nov: /^سپتامبر/i,
        dec: /^دسامبر/i,

        sat: /^شنبه/i,
        sun: /^یکشنبه/i,
        mon: /^دوشنبه/i,
        tue: /^سه شنبه/i,
        wed: /^چهارشنبه/i,
        thu: /^پنجشنبه/i,
        fri: /^جمعه/i,

        future: /^next/i,
        past: /^last|past|prev(ious)?/i,
        add: /^(\+|aft(er)?|from|hence)/i,
        subtract: /^(\-|bef(ore)?|ago)/i,

        yesterday: /^yes(terday)?/i,
        today: /^t(od(ay)?)?/i,
        tomorrow: /^tom(orrow)?/i,
        now: /^n(ow)?/i,

        millisecond: /^ms|milli(second)?s?/i,
        second: /^sec(ond)?s?/i,
        minute: /^mn|min(ute)?s?/i,
		hour: /^h(our)?s?/i,
		week: /^w(eek)?s?/i,
        month: /^m(onth)?s?/i,
        day: /^d(ay)?s?/i,
        year: /^y(ear)?s?/i,

        shortMeridian: /^(a|p)/i,
        longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i,
        timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i,
        ordinalSuffix: /^\s*(st|nd|rd|th)/i,
        timeContext: /^\s*(\:|a(?!u|p)|p)/i
    },

	timezones: [{name:"UTC", offset:"-000"}, {name:"GMT", offset:"-000"}, {name:"EST", offset:"-0500"}, {name:"EDT", offset:"-0400"}, {name:"CST", offset:"-0600"}, {name:"CDT", offset:"-0500"}, {name:"MST", offset:"-0700"}, {name:"MDT", offset:"-0600"}, {name:"PST", offset:"-0800"}, {name:"PDT", offset:"-0700"}]
};

/********************
 ** Future Strings **
 ********************
 *
 * The following list of strings may not be currently being used, but
 * may be incorporated into the Datejs library later.
 *
 * We would appreciate any help translating the strings below.
 *
 * If you modify this file, please post your revised CultureInfo file
 * to the Datejs Forum located at http://www.datejs.com/forums/.
 *
 * Please mark the subject of the post with [CultureInfo]. Example:
 *    Subject: [CultureInfo] Translated "da-DK" Danish(Denmark)b
 *
 * English Name        Translated
 * ------------------  -----------------
 * about               about
 * ago                 ago
 * date                date
 * time                time
 * calendar            calendar
 * show                show
 * hourly              hourly
 * daily               daily
 * weekly              weekly
 * bi-weekly           bi-weekly
 * fortnight           fortnight
 * monthly             monthly
 * bi-monthly          bi-monthly
 * quarter             quarter
 * quarterly           quarterly
 * yearly              yearly
 * annual              annual
 * annually            annually
 * annum               annum
 * again               again
 * between             between
 * after               after
 * from now            from now
 * repeat              repeat
 * times               times
 * per                 per
 * min (abbrev minute) min
 * morning             morning
 * noon                noon
 * night               night
 * midnight            midnight
 * mid-night           mid-night
 * evening             evening
 * final               final
 * future              future
 * spring              spring
 * summer              summer
 * fall                fall
 * winter              winter
 * end of              end of
 * end                 end
 * long                long
 * short               short
 */




JDate = function() {
	
	var $D = JDate,
	$P = $D.prototype,
	$GD = Date,
	$C = JDateCultureInfo;
	
	function JDate(year, month, date, hours, minutes, seconds, milliseconds){
		if(arguments.length == 1 && typeof year == number)
			this.GDate = new Date(year);
		else
			this.GDate = new Date();
		if(arguments.length >= 2){
			this.setFullYear(year, month, date);
			this.setHours(hours, minutes, seconds, milliseconds);
		}
		this.Date = upDate(this.getTime());
	};
	
	//	Getter Date
	$P.getFullYear = function(){
		/* if(this.Date.TS == parseInt(this.getTime()/86400000))
			return this.Date.Y;
		this.Date = upDate(this.getTime()); */
		return this.Date.Y;
	};
	$P.getUTCFullYear = function(){
		/* if(this.Date.TS == parseInt(this.getTime()/86400000))
			return this.Date.UY;
		this.Date = upDate(this.getTime()); */
		return this.Date.UY;
	};
	$P.getMonth = function(){
		/* if(this.Date.TS == parseInt(this.getTime()/86400000))
			return this.Date.M;
		this.Date = upDate(this.getTime()); */
		return this.Date.M;
	};
	$P.getUTCMonth = function(){
		/* if(this.Date.TS == parseInt(this.getTime()/86400000))
			return this.Date.UM;
		this.Date = upDate(this.getTime()); */
		return this.Date.UM;
	};
	$P.getDate = function(){
		/* if(this.Date.TS == parseInt(this.getTime()/86400000))
			return this.Date.D;
		this.Date = upDate(this.getTime()); */
		return this.Date.D;
	};
	$P.getUTCDate = function(){
		/* if(this.Date.TS == parseInt(this.getTime()/86400000))
			return this.Date.UD;
		this.Date = upDate(this.getTime()); */
		return this.Date.UD;
	};
	$P.getDay = function(){
		return (this.GDate.getDay()+1)%7;
	};
	$P.getUTCDay = function(){
		return (this.GDate.getUTCDay()+1)%7;
	};
	
	//	Getter Time
	$P.getHours = function(){
		return this.GDate.getHours();
	};
	$P.getUTCHours = function(){
		return this.GDate.getUTCHours();
	};
	$P.getMinutes = function(){
		return this.GDate.getMinutes();
	};
	$P.getUTCMinutes = function(){
		return this.GDate.getUTCMinutes();
	};
	$P.getSeconds = function(){
		return this.GDate.getSeconds();
	};
	$P.getUTCSeconds = function(){
		return this.GDate.getUTCSeconds();
	};
	$P.getMilliseconds = function(){
		return this.GDate.getMilliseconds();
	};
	$P.getUTCMilliseconds = function(){
		return this.GDate.getUTCMilliseconds();
	};
	$P.getTime = function(){
		return this.GDate.getTime();
	};
	$P.getTimezoneOffset = function(){
		return this.GDate.getTimezoneOffset();
	};
	
	//	Setter Date
	$P.setFullYear = function(yearValue, monthValue, dayValue){
		if(typeof dayValue == number){
			date = jalalitogregorian(yearValue, monthValue, dayValue);
			this.GDate.setFullYear(date[2], date[0]-1,date[1]);
		}
		else if(typeof monthValue == number){
			date = jalalitogregorian(yearValue, monthValue, this.getDate());
			this.GDate.setFullYear(date[2], date[0]-1);
		}
		else if(typeof yearValue == number){
			date = jalalitogregorian(yearValue, this.getMonth()+1, this.getDate());
			this.GDate.setFullYear(date[2]);
		}
		this.Date = upDate(this.getTime());
		return this.getTime();
	};
	$P.setUTCFullYear = function(yearValue, monthValue, dayValue){
		if(typeof dayValue == number){
			date = jalalitogregorian(yearValue, monthValue, dayValue);
			this.GDate.setUTCFullYear(date[2], date[0]-1,date[1]);
		}
		else if(typeof monthValue == number){
			date = jalalitogregorian(yearValue, monthValue, this.getUTCDate());
			this.GDate.setUTCFullYear(date[2], date[0]-1);
		}
		else if(typeof yearValue == number){
			date = jalalitogregorian(yearValue, this.getUTCMonth()+1, this.getUTCDate());
			this.GDate.setUTCFullYear(date[2]);
		}
		this.Date = upDate(this.getTime());
		return this.getTime();
	};
	$P.setMonth = function(monthValue, dayValue){
		if(typeof dayValue == number){
			date = jalalitogregorian(this.getFullYear(), monthValue, dayValue);
			this.GDate.setMonth(date[0]-1,date[1]);
		}
		else if(typeof monthValue == number){
			date = jalalitogregorian(this.getFullYear(), monthValue, this.getDate());
			this.GDate.setMonth(date[0]-1);
		}
		this.Date = upDate(this.getTime());
		return this.getTime();
	};
	$P.setUTCMonth = function(monthValue, dayValue){
		if(typeof dayValue == number){
			date = jalalitogregorian(this.getUTCFullYear(), monthValue, dayValue);
			this.GDate.setUTCMonth(date[0]-1,date[1]);
		}
		else if(typeof monthValue == number){
			date = jalalitogregorian(this.getUTCFullYear(), monthValue, this.getUTCDate());
			this.GDate.setUTCMonth(date[0]-1);
		}
		this.Date = upDate(this.getTime());
		return this.getTime();
	};
	$P.setDate = function(dayValue){
		if(typeof dayValue == number){
			date = jalalitogregorian(this.getFullYear(), this.getMonth()+1, dayValue);
			this.GDate.setDate(date[1]);
		}
		this.Date = upDate(this.getTime());
		return this.getTime();
	};
	$P.setUTCDate = function(dayValue){
		if(typeof dayValue == number){
			date = jalalitogregorian(this.getUTCFullYear(), this.getUTCMonth()+1, dayValue);
			this.GDate.setUTCDate(date[1]);
		}
		this.Date = upDate(this.getTime());
		return this.getTime();
	};
	
	//	Setter Time
	$P.setHours = function(hoursValue, minutesValue, secondsValue, msValue){
		if(typeof msValue == number)
			return this.GDate.setHours(hoursValue, minutesValue, secondsValue, msValue);
		else if(typeof secondsValue == number)
			return this.GDate.setHours(hoursValue, minutesValue, secondsValue);
		else if(typeof minutesValue == number)
			return this.GDate.setHours(hoursValue, minutesValue );
		else if(typeof hoursValue == number)
			return this.GDate.setHours(hoursValue);
		return this.getTime();
	};
	$P.setUTCHours = function(hoursValue, minutesValue, secondsValue, msValue){
		if(typeof msValue == number)
			return this.GDate.setUTCHours(hoursValue, minutesValue, secondsValue, msValue);
		else if(typeof secondsValue == number)
			return this.GDate.setUTCHours(hoursValue, minutesValue, secondsValue);
		else if(typeof minutesValue == number)
			return this.GDate.setUTCHours(hoursValue, minutesValue );
		else if(typeof hoursValue == number)
			return this.GDate.setUTCHours(hoursValue);
		return this.getTime();
	};
	$P.setMinutes = function(minutesValue, secondsValue, msValue){
		if(typeof msValue == number)
			return this.GDate.setMinutes(minutesValue, secondsValue, msValue);
		else if(typeof secondsValue == number)
			return this.GDate.setMinutes(minutesValue, secondsValue);
		else if(typeof minutesValue == number)
			return this.GDate.setMinutes(minutesValue );
		return this.getTime();
	};
	$P.setUTCMinutes = function(minutesValue, secondsValue, msValue){
		if(typeof msValue == number)
			return this.GDate.setUTCMinutes(minutesValue, secondsValue, msValue);
		else if(typeof secondsValue == number)
			return this.GDate.setUTCMinutes(minutesValue, secondsValue);
		else if(typeof minutesValue == number)
			return this.GDate.setUTCMinutes(minutesValue );
		return this.getTime();
	};
	$P.setSeconds = function(secondsValue, msValue){
		if(typeof msValue == number)
			return this.GDate.setSeconds(secondsValue, msValue);
		else if(typeof secondsValue == number)
			return this.GDate.setSeconds(secondsValue);
		return this.getTime();
	};
	$P.setUTCSeconds = function(secondsValue, msValue){
		if(typeof msValue == number)
			return this.GDate.setSeconds(secondsValue, msValue);
		else if(typeof secondsValue == number)
			return this.GDate.setSeconds(secondsValue);
		return this.getTime();
	};
	$P.setMilliseconds = function(millisecondsValue){
		if(typeof msValue == number)
			return this.GDate.setMilliseconds(millisecondsValue);
		return this.getTime();
	};
	$P.setUTCMilliseconds = function(millisecondsValue){
		if(typeof msValue == number)
			return this.GDate.setUTCMilliseconds(millisecondsValue);
		return this.getTime();
	};
	$P.setTime = function(timeValue){
		if(typeof timeValue == number)
			return this.GDate.setTime(timeValue);
		return this.getTime();
	};
	
	//	Conversion getter
	$P.toTimeString = function(){
		return this.GDate.toTimeString();
	};
	$P.valueOf = function(){
		return this.GDate.valueOf();
	};
	$P.toLocaleTimeString = function(locales, options){
		return this.GDate.toLocaleTimeString();
	};
	/**
	* Converts the current date instance into a string with an ISO 8601 format. The date is converted to it's UTC value.
	* @return {String}  ISO 8601 string of date
	*/
	$P.toISOString = function () {
		// From http://www.json.org/json.js. Public Domain. 
		function f(n) {
			return n < 10 ? '0' + n : n;
		}

		return '"' + this.getUTCFullYear()   + '-' +
		f(this.getUTCMonth() + 1) + '-' +
		f(this.getUTCDate())      + 'T' +
		f(this.getUTCHours())     + ':' +
		f(this.getUTCMinutes())   + ':' +
		f(this.getUTCSeconds())   + 'Z"';
	};
		
    /**
     * Converts the value of the current Date object to its equivalent string representation.
     * Format Specifiers
    <pre>
    CUSTOM DATE AND TIME FORMAT STRINGS
    Format  Description                                                                  Example
    ------  ---------------------------------------------------------------------------  -----------------------
     s      The seconds of the minute between 0-59.                                      "0" to "59"
     ss     The seconds of the minute with leading zero if required.                     "00" to "59"
     
     m      The minute of the hour between 0-59.                                         "0"  or "59"
     mm     The minute of the hour with leading zero if required.                        "00" or "59"
     
     h      The hour of the day between 1-12.                                            "1"  to "12"
     hh     The hour of the day with leading zero if required.                           "01" to "12"
     
     H      The hour of the day between 0-23.                                            "0"  to "23"
     HH     The hour of the day with leading zero if required.                           "00" to "23"
     
     d      The day of the month between 1 and 31.                                       "1"  to "31"
     dd     The day of the month with leading zero if required.                          "01" to "31"
     ddd    Abbreviated day name. $C.abbreviatedDayNames.                                "Mon" to "Sun" 
     dddd   The full day name. $C.dayNames.                                              "Monday" to "Sunday"
     
     M      The month of the year between 1-12.                                          "1" to "12"
     MM     The month of the year with leading zero if required.                         "01" to "12"
     MMM    Abbreviated month name. $C.abbreviatedMonthNames.                            "Jan" to "Dec"
     MMMM   The full month name. $C.monthNames.                                          "January" to "December"

     yy     The year as a two-digit number.                                              "99" or "08"
     yyyy   The full four digit year.                                                    "1999" or "2008"
     
     t      Displays the first character of the A.M./P.M. designator.                    "A" or "P"
            $C.amDesignator or $C.pmDesignator
     tt     Displays the A.M./P.M. designator.                                           "AM" or "PM"
            $C.amDesignator or $C.pmDesignator
     
     S      The ordinal suffix ("st, "nd", "rd" or "th") of the current day.            "st, "nd", "rd" or "th"

|| *Format* || *Description* || *Example* ||
|| d      || The CultureInfo shortDate Format Pattern                                     || "M/d/yyyy" ||
|| D      || The CultureInfo longDate Format Pattern                                      || "dddd, MMMM dd, yyyy" ||
|| F      || The CultureInfo fullDateTime Format Pattern                                  || "dddd, MMMM dd, yyyy h:mm:ss tt" ||
|| m      || The CultureInfo monthDay Format Pattern                                      || "MMMM dd" ||
|| r      || The CultureInfo rfc1123 Format Pattern                                       || "ddd, dd MMM yyyy HH:mm:ss GMT" ||
|| s      || The CultureInfo sortableDateTime Format Pattern                              || "yyyy-MM-ddTHH:mm:ss" ||
|| t      || The CultureInfo shortTime Format Pattern                                     || "h:mm tt" ||
|| T      || The CultureInfo longTime Format Pattern                                      || "h:mm:ss tt" ||
|| u      || The CultureInfo universalSortableDateTime Format Pattern                     || "yyyy-MM-dd HH:mm:ssZ" ||
|| y      || The CultureInfo yearMonth Format Pattern                                     || "MMMM, yyyy" ||
     

    STANDARD DATE AND TIME FORMAT STRINGS
    Format  Description                                                                  Example ("en-US")
    ------  ---------------------------------------------------------------------------  -----------------------
     d      The CultureInfo shortDate Format Pattern                                     "M/d/yyyy"
     D      The CultureInfo longDate Format Pattern                                      "dddd, MMMM dd, yyyy"
     F      The CultureInfo fullDateTime Format Pattern                                  "dddd, MMMM dd, yyyy h:mm:ss tt"
     m      The CultureInfo monthDay Format Pattern                                      "MMMM dd"
     r      The CultureInfo rfc1123 Format Pattern                                       "ddd, dd MMM yyyy HH:mm:ss GMT"
     s      The CultureInfo sortableDateTime Format Pattern                              "yyyy-MM-ddTHH:mm:ss"
     t      The CultureInfo shortTime Format Pattern                                     "h:mm tt"
     T      The CultureInfo longTime Format Pattern                                      "h:mm:ss tt"
     u      The CultureInfo universalSortableDateTime Format Pattern                     "yyyy-MM-dd HH:mm:ssZ"
     y      The CultureInfo yearMonth Format Pattern                                     "MMMM, yyyy"
    </pre>
     * @param {String}   A format string consisting of one or more format spcifiers [Optional].
     * @return {String}  A string representation of the current Date object.
     */

    $P.toString = function (format) {
        var x = this;
        if(!arguments.length)
			format = 'S';
        // Standard Date and Time Format Strings. Formats pulled from CultureInfo file and
        // may vary by culture. 
        if (format && format.length == 1) {
            var c = $C.formatPatterns;
            switch (format) {
				case "d": 
					format = c.shortDate;break;
				case "D":
					format = c.longDate;break;
				case "F":
					format = c.fullDateTime;break;
				case "m":
					format = c.monthDay;break;
				case "r":
					format = c.rfc1123;break;
				case "s":
					format = c.sortableDateTime;break;
				case "t":
					format = c.shortTime;break;
				case "T":
					format = c.longTime;break;
				case "u":
					format = c.universalSortableDateTime;break;
				case "y":
					format = c.yearMonth;break;
				case "S":
				default:
					format = c.toString;break;
				}
        }
        
        var ord = function (n) {
                switch (n * 1) {
                case 1: 
                case 21: 
                case 31: 
                    return "st";
                case 2: 
                case 22: 
                    return "nd";
                case 3: 
                case 23: 
                    return "rd";
                default: 
                    return "th";
                }
            };
			
		var p = function (s, l) {
            if (!l) {
                l = 2;
            }
            return ("000" + s).slice(l * -1);
        };
        
        return format.replace(/(\\)?U?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S|TS)/g, 
        function (m) {
            if (m.charAt(0) === "\\") {
                return m.replace("\\", "");
            }
            x.h = x.getHours;
            x.Uh = x.getUTCHours;
			
            switch (m) {
				case "hh":
					return p(x.h() < 13 ? (x.h() === 0 ? 12 : x.h()) : (x.h() - 12));
				case "Uhh":
					return p(x.Uh() < 13 ? (x.Uh() === 0 ? 12 : x.Uh()) : (x.Uh() - 12));
				case "h":
					return x.h() < 13 ? (x.h() === 0 ? 12 : x.h()) : (x.h() - 12);
				case "Uh":
					return x.Uh() < 13 ? (x.Uh() === 0 ? 12 : x.Uh()) : (x.Uh() - 12);
				case "HH":
					return p(x.h());
				case "UHH":
					return p(x.Uh());
				case "H":
					return x.h();
				case "UH":
					return x.Uh();
				case "mm":
					return p(x.getMinutes());
				case "Umm":
					return p(x.getUTCMinutes());
				case "m":
					return x.getMinutes();
				case "Um":
					return x.getUTCMinutes();
				case "ss":
					return p(x.getSeconds());
				case "Uss":
					return p(x.getUTCSeconds());
				case "s":
					return x.getSeconds();
				case "Us":
					return x.getUTCSeconds();
				case "t":
					return x.h() < 12 ? $C.amDesignator.substring(0, 1) : $C.pmDesignator.substring(0, 1);
				case "Ut":
					return x.Uh() < 12 ? $C.amDesignator.substring(0, 1) : $C.pmDesignator.substring(0, 1);
				case "tt":
					return x.h() < 12 ? $C.amDesignator : $C.pmDesignator;
				case "Utt":
					return x.Uh() < 12 ? $C.amDesignator : $C.pmDesignator;
				case "yyyy":
					return p(x.getFullYear(), 4);
				case "Uyyyy":
					return p(x.getUTCFullYear(), 4);
				case "yy":
					return p(x.getFullYear());
				case "Uyy":
					return p(x.getUTCFullYear());
				case "MMMM":
					return $C.monthNames[x.getMonth()];
				case "UMMMM":
					return $C.monthNames[x.getUTCMonth()];
				case "MMM":
					return $C.abbreviatedMonthNames[x.getMonth()];
				case "UMMM":
					return $C.abbreviatedMonthNames[x.getUTCMonth()];
				case "MM":
					return p((x.getMonth() + 1));
				case "UMM":
					return p((x.getUTCMonth() + 1));
				case "M":
					return x.getMonth() + 1;
				case "UM":
					return x.getUTCMonth() + 1;
				case "dddd":
					return $C.dayNames[x.getDay()];
				case "Udddd":
					return $C.dayNames[x.getUTCDay()];
				case "ddd":
					return $C.abbreviatedDayNames[x.getDay()];
				case "Uddd":
					return $C.abbreviatedDayNames[x.getUTCDay()];
				case "dd":
					return p(x.getDate());
				case "Udd":
					return p(x.getUTCDate());
				case "d":
					return x.getDate();
				case "Ud":
					return x.getUTCDate();
				case "S":
					return ord(x.getDate());
				case "US":
					return ord(x.getUTCDate());
				case "TS":
					return x.toTimeString();
				case "UTS":
					return x.toTimeUTCString();
				default: 
					return m;
            }
        }
        );
    };
	$P.toISOString = function() {
	  return this.toString('Uyyyy-UMM-UddTUHH:Uii:Uss.Ul')+'Z';
	}
	$P.toDateString = function() {
		return this.toString('ddd MMM dd yyyy');
	}
	$P.toJSON = function() {
		return this.toISOString();
	}
	$P.toUTCString = function() {
		return this.toString('Uddd, Udd UMMM Uyyyy UHH:Uii:Uss')+' GMT';
	}
	/**
     * Resets the time of this Date object to 12:00 AM (00:00), which is the start of the day.
     * @param {Boolean}  .clone() this date instance before clearing Time
     * @return {Date}    this
     */
    $P.clearTime = function () {
        this.setHours(0,0,0,0);
        /* this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0); */
        return this;
    };

    /**
     * Resets the time of this Date object to the current time ('now').
     * @return {Date}    this
     */
    $P.setTimeToNow = function () {
        var n = new Date();
        this.setHours(n.getHours(),n.getMinutes(),n.getSeconds(),n.getMilliseconds());
        return this;
    };

    /**
     * Returns a new JDate object that is an exact date and time copy of the original instance.
     * @return {Date}    A new Date instance
     */
    $P.clone = function () {
        return new JDate(this.getTime()); 
    };
	
    /**
     * Get the time zone abbreviation of the current date.
     * @return {String} The abbreviated time zone name (e.g. "EST")
     */
    $P.getTimezone = function () {
        return $D.getTimezoneAbbreviation(this.getUTCOffset());
    };

    $P.setTimezoneOffset = function (offset) {
        var here = this.getTimezoneOffset(), there = Number(offset) * -6 / 10;
        return this.addMinutes(there - here); 
    };

    $P.setTimezone = function (offset) { 
        return this.setTimezoneOffset($D.getTimezoneOffset(offset)); 
    };

    /**
     * Indicates whether Daylight Saving Time is observed in the current time zone.
     * @return {Boolean} true|false
     */
    $P.hasDaylightSavingTime = function () { 
        return (Date.today().set({month: 0, day: 1}).getTimezoneOffset() !== Date.today().set({month: 6, day: 1}).getTimezoneOffset());
    };
    
    /**
     * Indicates whether this Date instance is within the Daylight Saving Time range for the current time zone.
     * @return {Boolean} true|false
     */
    $P.isDaylightSavingTime = function () {
        return Date.today().set({month: 0, day: 1}).getTimezoneOffset() != this.getTimezoneOffset();
    };
	
	$P.getWeek = function () {
        return $D.getWeekOfYear(this.Date.Y,this.Date.M,this.Date.D,$D.FirstDayOfWeek);
    };

    /**
     * Get the offset from UTC of the current date.
     * @return {String} The 4-character offset string prefixed with + or - (e.g. "-0500")
     */
    $P.getUTCOffset = function () {
        var n = this.getTimezoneOffset() * -10 / 6, r;
        if (n < 0) { 
            r = (n - 10000).toString(); 
            return r.charAt(0) + r.substr(2); 
        } else { 
            r = (n + 10000).toString();  
            return "+" + r.substr(1); 
        }
    };
	
	$D.now =  function(){ return $GD.now(); };
	$D.length = $GD.length;
	$D.FirstDayOfWeek = $C.firstDayOfWeek; // 0 = Satarday 
    /** 
     * Gets a date that is set to the current date. The time is set to the start of the day (00:00 or 12:00 AM).
     * @return {Date}    The current date.
     */
    $D.today = function () {
        return new JDate().clearTime();
    };
	
    /**
     * Gets the day number (0-6) if given a CultureInfo specific string which is a valid dayName, abbreviatedDayName or shortestDayName (two char).
     * @param {String}   The name of the day (eg. "Monday, "Mon", "tuesday", "tue", "We", "we").
     * @return {Number}  The day number
     */
    $D.getDayNumberFromName = function (name) {
        var n = $C.dayNames, m = $C.abbreviatedDayNames, o = $C.shortestDayNames, s = name.toLowerCase();
        for (var i = 0; i < n.length; i++) { 
            if (n[i].toLowerCase() == s || m[i].toLowerCase() == s || o[i].toLowerCase() == s) { 
                return i; 
            }
        }
        return -1;  
    };
    
    /**
     * Gets the month number (0-11) if given a Culture Info specific string which is a valid monthName or abbreviatedMonthName.
     * @param {String}   The name of the month (eg. "February, "Feb", "october", "oct").
     * @return {Number}  The day number
     */
    $D.getMonthNumberFromName = function (name) {
        var n = $C.monthNames, m = $C.abbreviatedMonthNames, s = name.toLowerCase();
        for (var i = 0; i < n.length; i++) {
            if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) { 
                return i; 
            }
        }
        return -1;
    };
    $D.getMonthFullNames = function (num) {
        return $C.monthNames[num];
    };

    /**
     * Determines if the current date instance is within a LeapYear.
     * @param {Number}   The year.
     * @return {Boolean} true if date is within a LeapYear, otherwise false.
     */
    $D.isLeap = function (year) { //yearValue
        return ((parseInt((year+=1128)*365.2422)-parseInt(--year*365.2422))-365); 
    };
    $D.isLeaps = function (year) { //yearValue
        return (Math.ceil(((year+=1127)*365.2422)-year*365)-274); 
    };
    $GD.isLeap = function (year) { //yearValue
        return parseInt((year%4==0)&&!((year%100==0)&&(year%400!= 0))); 
    };
    $GD.isLeaps = function (year) { //yearValue
        return (Math.ceil(parseInt((--year)/4)-parseInt((year)/100)+parseInt((year)/400))-150); 
    };
	$D.getWeekOfYear = function (jy,jm,jd,FDOW){//yearValue
		if(typeof FDOW != number)
			FDOW = 0;
		// best and new calculator week of year
		doy = $D.getDayOfYear(jy,jm,jd)+1; // 1 through 365-6
		far1dow = $D.getDayOfWeek(jy,0,1,FDOW)+1; // 1 through 7
		/* Find if Y M D falls in YearNumber --Y, WeekNumber 52 or 53 */
		if(doy<=(8-far1dow)&&far1dow>4){
			jy--;
			iy = jy;
			//$iw = ($far1dow == 5||($far1dow == 6&&self::is_leap_($jy)))?53:52;
			if(far1dow == 5||(far1dow == 6&&$D.isLeap(jy)))
				iw = 53;
			else
				iw = 52;
			return [iy,$iw];
		}
		/* 8. Find if Y M D falls in YearNumber ++Y, WeekNumber 1 */
		esf29dow = $D.getDayOfWeek(jy,11,$D.getDaysInMonth(jy,11),FDOW)+1; // 1 through 7
		if(doy>($D.getDaysInYear(jy)-esf29dow)&&esf29dow<4){
			jy++;
			iy = $jy;
			iw = 1;
			return [iy,iw];
		}
		/* 9. Find if Y M D falls in YearNumber Y, WeekNumber 1 through 52|53 */
		iy = jy;
		iw = (doy+5+far1dow-$D.getDayOfWeek(jy,jm,jd,FDOW))/7;
		if(far1dow>4)
			iw--;
		return [iy,iw];
	}
	
	$D.getDayOfWeek = function (jy,jm,jd,FDOW){//yearValue
		if(typeof FDOW != number)
			FDOW = 0;
		return (jy+$D.isLeaps(jy)+$D.getDayOfYear(jy,jm,jd)+5-FDOW)%7;
	};
	
	$D.getDayOfYear = function (jy,jm,jd){//yearValue
		return [ 0, 31, 62, 93, 124,155,186,216,246,276,306,336][jm]+jd-1;
	};

	$D.getDaysInYear = function (jy){//yearValue
		return $D.isLeap(jy)?366:365;	//**************************************
	};
	$D.checkDate = function (jy,jm,jd){//yearValue
		return !(jy<1||jy>3500000 /*3500000  3,500,000 */||jm<0||jm>11||jd<1||jd>$D.getDaysInMonth(jy,jm));
	};
	
	$D.checkTime = function (h,i,s){//yearValue
		return !(h<0||h>23||i<0||i>59||s<0||s>59);
	};
	$D.getRDayOfYear = function (jy,doy){//yearValue
		if(jy<1) return false;
		doy++;
		diy = $D.getDaysInYear(jy);
		if(doy<1)
			do{
				jy--;
				doy += $D.getDaysInYear(jy);
			}while(doy<1);
		else if(doy>diy)
			do{
				doy -= diy;
				jy++;
				diy = $D.getDaysInYear(jy);
			}while(doy>diy);
		if(doy<187){
			jm = parseInt((doy-1)/31);
			doy %= 31;
			jd = doy?doy:31;
		}
		else{
			doy-=186;
			jm = parseInt((doy-1)/30)+6;
			doy %= 30;
			jd = doy?doy:30;
		}
		return [jy,jm,jd];
	};
	$GD.getDaysInYear = function (gy){//yearValue
		return $GD.isLeap(gy)?366:365;
	};
	$GD.getRDayOfYear = function (gy,doy){//yearValue
		if(gy<1) return false;
		doy++;
		diy = $GD.getDaysInYear(gy);
		if(doy<1)
			do{
				gy--;
				doy += $GD.getDaysInYear(gy);
			}while(doy<1);
		else if(doy>diy)
			do{
				doy -= diy;
				gy++;
				diy = $GD.getDaysInYear(gy);
			}while(doy>diy);
		gms = [0,31,($GD.isLeap(gy)+28),31,30,31,30,31,31,30,31,30,31];
		for(i in gms){
			if (doy<=gms[i])break;
			doy -= gms[i];
		}
		return [i,parseInt(doy),gy];
	};
    /**
     * Gets the number of days in the month, given a year and month value. Automatically corrects for LeapYear.
     * @param {Number}   The year.
     * @param {Number}   The month (0-11).
     * @return {Number}  The number of days in the month.
     */
    $D.getDaysInMonth = function (year, month) {//yearValue
        return [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, ($D.isLeap(year) ? 30 : 29)][month];
    };
    
    $D.getTimezoneAbbreviation = function (offset) {
        var z = $C.timezones, p;
        for (var i = 0; i < z.length; i++) {
            if (z[i].offset === offset) {
                return z[i].name;
            }
        }
        return null;
    };
    
    $D.getTimezoneOffset = function (name) {
        var z = $C.timezones, p;
        for (var i = 0; i < z.length; i++) {
            if (z[i].name === name.toUpperCase()) {
                return z[i].offset;
            }
        }
        return null;
    };

    // private
	function upDate(TS){
		GDate = new Date(TS);
		D = gregoriantojalali(GDate.getMonth(),GDate.getDate(),GDate.getFullYear());
		GD = gregoriantojalali(GDate.getUTCMonth(),GDate.getUTCDate(),GDate.getUTCFullYear());
		return {
				'Y':D[0],'M':D[1],'D':D[2],
				'UY':GD[0],'UM':GD[1],'UD':GD[2],
				'TS':parseInt(TS/86400000),
				'UTS':parseInt((TS+GDate.getTimezoneOffset())/86400000)
			};
	}
	
	/* function setLang(lang){
		switch(lang){
			case $C.name: return $C.name;
			default:return $C.name;
		}
	}; */
	
    var validate = function (n, min, max, name) {//yearValue
        if (typeof n == "undefined") {
            return false;
        } else if (typeof n != "number") {
            throw new TypeError(n + " is not a Number."); 
        } else if (n < min || n > max) {
            throw new RangeError(n + " is not a valid value for " + name + "."); 
        }
        return true;
    };

	function gregoriantojalali(gm,gd,gy){//yearValue
		gdoy = (gy-1)*365+[0, 31, 59, 90,120,151,181,212,243,273,304,334][gm]+gd-226745;
		if($GD.isLeap(gy)&&gm>2)gdoy++;
		jy = parseInt(gdoy/365)+1;
		jdoy = gdoy%365+$GD.isLeaps(gy)-$D.isLeaps(jy);
		return $D.getRDayOfYear(jy,jdoy-1);
	};
	
	function jalalitogregorian(jy,jm,jd){//yearValue
		jdoy = (jy-1)*365+$D.day_of_year(jy,jm,jd)+226746; // +0622/03/22 = 0001/01/01
		gy = parseInt(jdoy/365)+1;
		gdoy = jdoy%365+$D.isLeaps(jy)-$GD.isLeaps(gy);
		return $GD.getRDayOfYear(gy,gdoy-1);
	};
	
	return JDate;
}();





/* Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
}; */



//const JDate = Object.create(JDate);





//document.write(printElapsedTime(nStartTime));

