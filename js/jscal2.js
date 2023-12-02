console.time('Timer1');

/**
 *                                                        ____   _____
 *  MD Calendar -- JS Cal, version 2               \  /_  /   /
 *  Built at 2018/12/30 09:35 GMT                          \  / /   /
 *                                                          \/ /_  /
 *  (c) Akhi.ir 2018-2020                                \  / /
 *  All rights reserved.                                       / /
 *  Visit www.Akhi.ir/projects/calendar for details        \/
 *
 */


  var dw=function(obj) {
	if(arguments.length>1)
		for(var j in obj)
			dw(j)
	var pre,i=0,out = ''
	if("object" == typeof obj || "array" == typeof obj)
		for (var it in obj){
			
			out+=i++ +'::'+ it + " </br> " +obj[it] +" </br>";
			//debugger;
			//console.log(obj[it]);
		}
	else{
			out+=i++ +'::'+ obj +" </br>";
			//debugger;
			//console.log(obj);
	}
	console.log(obj)
	pre = document.createElement('pre')
	pre.innerHTML = "+++---{{{<br><code>"+out+"</code><br>}}}---+++"
	document.body.appendChild(pre)
}





 //this function includes all necessary js files for the application
/* function include(file)
{

  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);
} */

/* include any js files here */
//include('src/js/jdate.js');


Calendar=function(){
	
	function Cal(args){//t
		var tis,dt,built
		args=args||{}
		,this.args=args=setArgs(args,{
			animation:!is_ie6
			,cont:null
			,bottomBar:true
			,date:true
			,fdow:_("fdow")
			,min:null
			,max:null
			,reverseWheel:false
			,selection:[]
			,selectionType:Cal.SEL_SINGLE
			,weekNumbers:false
			,align:"Bl/ / /T/r"
			,inputField:null
			,trigger:null
			,dateFormat:"%Y/%m/%d"
			,multiCtrl:true
			,fixed:false
			,opacity:is_ie?1:3
			,titleFormat:"%b %Y"
			,showTime:false
			,timePos:"left"
			,time:true
			,minuteStep:5
			,noScroll:false
			,disabled:func
			,checkRange:false
			,dateInfo:func
			,onChange:func
			,onSelect:func
			,onTimeChange:func
			,onFocus:func
			,onBlur:func
			,onClose:func
		})
		,this.listeners={}
		,dt=new Date
		,jdt=new JDate()
		,args.min=isToDate(args.min)
		,args.max=isToDate(args.max)
		if(args.date===true)
			args.date=dt
		if(args.time===true)
			args.time=dt.getHours()*100+Math.floor(dt.getMinutes()/args.minuteStep)*args.minuteStep
		this.date=isToDate(args.date)
		,this.time=args.time
		,this.fdow=args.fdow
		,tis=this
		,setFanc("onChange onSelect onTimeChange onFocus onBlur onClose".split(/\s+/)
			,function(type){
				var funcName=args[type]
				if(!(funcName instanceof Array))
					funcName=[funcName]
				,tis.listeners[type]=funcName
			}
		)
		,this.selection=new Cal.Selection(args.selection,args.selectionType,inputField,this)
		,built=CalCreate.call(this)
		if(args.cont)
			getElementById(args.cont).appendChild(built)
		if(args.trigger)
			this.manageFields(args.trigger,args.inputField,args.dateFormat)
	}
	
	function CalWeeks(weekNumbers,fdow){//e
		var weekend
		table=["<table",TableCell,"><tr>"]
		if(weekNumbers)
			table.push("<td><div class='DynarchCalendar-weekNumber'>",_("wk"),"</div></td>")
		for(i=0;7>i;){
			weekend=(i++ +fdow)%7
			,table.push("<td><div",_("weekend").indexOf(weekend)<0?">":" class='DynarchCalendar-weekend'>",_("sdn")[weekend],"</div></td>")
		}
		table.push("</tr></table>")
		return table.join("")
	}
	
	function CalDay(date,fdow){//n
		var month,table,itable,weeks,dow,datenow,daynow,monthnow,yearnow,row,col,daycol,monthcol,yearcol,fulldatecol,isSel,isDis
		date=date||this.date
		,date=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12,0,0,0)
		,month=date.getMonth()
		,date.setDate(1)
		,fdow=fdow||this.fdow
		,dow=(date.getDay()-fdow)%7
		if(0>dow)
			dow+=7
		date.setDate(0-dow)
		,date.setDate(date.getDate()+1)
		,datenow=new Date
		,daynow=datenow.getDate()
		,monthnow=datenow.getMonth()
		,yearnow=datenow.getFullYear()
		,table=[]
		,itable=0
		,weeks=this.args.weekNumbers
		,table[itable++]="<table class='DynarchCalendar-bodyTable'"+TableCell+">"
		for(row=0;row<6;++row){
			table[itable++]="<tr class='DynarchCalendar-week"
			if(0==row)
				table[itable++]=" DynarchCalendar-first-row"
			if(5==row)
				table[itable++]=" DynarchCalendar-last-row"
			table[itable++]="'>"
			if(weeks)
				table[itable++]="<td class='DynarchCalendar-first-col'><div class='DynarchCalendar-weekNumber'>"+weekOfYear(date)+"</div></td>"
			for(col=0;col<7;++col){
				daycol=date.getDate()
				,monthcol=date.getMonth()
				,yearcol=date.getFullYear()
				,fulldatecol=1e4*yearcol+100*(monthcol+1)+daycol
				,isSel=this.selection.isSelected(fulldatecol)
				,isDis=this.isDisabled(date)
				,table[itable++]="<td class='"
				if(!(0!=col||weeks))
					table[itable++]=" DynarchCalendar-first-col"
				if(0==col&&0==row)
					this._firstDateVisible=fulldatecol
				if(6==col){
					table[itable++]=" DynarchCalendar-last-col"
					if(5==row)
						this._lastDateVisible=fulldatecol
				}
				if(isSel)
					table[itable++]=" DynarchCalendar-td-selected"
				table[itable++]="'><div dyc-type='date' unselectable='on' dyc-date='"+fulldatecol+"' "
				if(isDis)
					table[itable++]="disabled='1' "
				table[itable++]="class='DynarchCalendar-day"
				if(!(_("weekend").indexOf(date.getDay())<0))
					table[itable++]=" DynarchCalendar-weekend"
				if(monthcol!=month)
					table[itable++]=" DynarchCalendar-day-othermonth"
				if(daycol==daynow&&monthcol==monthnow&&yearcol==yearnow)
					table[itable++]=" DynarchCalendar-day-today"
				if(isDis)
					table[itable++]=" DynarchCalendar-day-disabled"
				if(isSel)
					table[itable++]=" DynarchCalendar-day-selected"
				isDis=this.args.dateInfo(date)
				if(isDis&&isDis.klass)
					table[itable++]=" "+isDis.klass
				table[itable++]="'>"+daycol+"</div></td>"
				,date=new Date(yearcol,monthcol,daycol+1,12,0,0,0)
			}
			table[itable++]="</tr>"
		}
		table[itable++]="</table>"
		return table.join("")
	}
	
	function CalBody(){//a
		var table=["<table class='DynarchCalendar-topCont'"
			,TableCell
			,"><tr><td>"
			,"<div class='DynarchCalendar'>"
			,is_ie?"<a class='DynarchCalendar-focusLink' href='#'></a>":"<button class='DynarchCalendar-focusLink'></button>"
			,"<div class='DynarchCalendar-topBar'>"
			,"<div dyc-type='nav' dyc-btn='-Y' dyc-cls='hover-navBtn,pressed-navBtn' "
			,"class='DynarchCalendar-navBtn DynarchCalendar-prevYear'><div></div></div>"
			,"<div dyc-type='nav' dyc-btn='+Y' dyc-cls='hover-navBtn,pressed-navBtn' "
			,"class='DynarchCalendar-navBtn DynarchCalendar-nextYear'><div></div></div>"
			,"<div dyc-type='nav' dyc-btn='-M' dyc-cls='hover-navBtn,pressed-navBtn' "
			,"class='DynarchCalendar-navBtn DynarchCalendar-prevMonth'><div></div></div>"
			,"<div dyc-type='nav' dyc-btn='+M' dyc-cls='hover-navBtn,pressed-navBtn' "
			,"class='DynarchCalendar-navBtn DynarchCalendar-nextMonth'><div></div></div>"
			,"<table class='DynarchCalendar-titleCont'"
			,TableCell
			,"><tr><td>"
			,"<div dyc-type='title' dyc-btn='menu' dyc-cls='hover-title,pressed-title' class='DynarchCalendar-title'>"
			,CalTitle(this.date,this.args.titleFormat)
			,"</div></td></tr></table>"
			,"<div class='DynarchCalendar-dayNames'>"
			,CalWeeks(this.args.weekNumbers,this.fdow)
			,"</div>","</div>","<div class='DynarchCalendar-body'></div>"];
		if(this.args.bottomBar||this.args.showTime)
			table.push("<div class='DynarchCalendar-bottomBar'>"
				,CalbottomBar(this.args)
				,"</div>")
		table.push("<div class='DynarchCalendar-menu' style='display: none'>"
			,CalMenu(this.date.getFullYear())
			,"</div>"
			,"<div class='DynarchCalendar-tooltip'></div>"
			,"</div>"
			,"</td></tr></table>")
		return table.join("")
	}
	
	function CalTitle(date,titleFormat){//s
		return"<div unselectable='on'>"+printDate(date,titleFormat)+"</div>"
	}
		
	function CalMenu(year){//i 
		var row
		,table=["<table height='100%'",TableCell,"><tr><td>"
			,"<table style='margin-top: 1.5em'",TableCell,">"
			,"<tr><td colspan='3'><input dyc-btn='year' class='DynarchCalendar-menu-year' size='6' value='"
			,year
			,"' /></td></tr>"
			,"<tr><td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='today'>"
			,_("goToday")
			,"</div></td></tr>","</table>"
			,"<p class='DynarchCalendar-menu-sep'>&nbsp;</p>"
			,"<table class='DynarchCalendar-menu-mtable'",TableCell,">"]
		,shortmonth=_("smn")
		,itable=table.length
		for(im=0;12>im;){
			table[itable++]="<tr>"
			for(row=4;--row>0;)
				table[itable++]="<td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='m"+im+"' class='DynarchCalendar-menu-month'>"+shortmonth[im++]+"</div></td>"
			table[itable++]="</tr>"
		}
		table[itable++]="</table></td></tr></table>"
		return table.join("")
	}
	
	function CalTime(showTime){//r
		var table=["<table class='DynarchCalendar-time'"+TableCell+"><tr>"
			,"<td rowspan='2'><div dyc-type='time-hour' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-hour'></div></td>"
			,"<td dyc-type='time-hour+' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-up'></td>"
			,"<td rowspan='2' class='DynarchCalendar-time-sep'></td>"
			,"<td rowspan='2'><div dyc-type='time-min' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-minute'></div></td>"
			,"<td dyc-type='time-min+' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-up'></td>"];
		if(showTime==12){
			table.push("<td rowspan='2' class='DynarchCalendar-time-sep'></td>"
			,"<td rowspan='2'><div class='DynarchCalendar-time-am' dyc-type='time-am' dyc-cls='hover-time,pressed-time'></div></td>")
		}
		table.push("</tr><tr>"
			,"<td dyc-type='time-hour-' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-down'></td>"
			,"<td dyc-type='time-min-' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-down'></td>"
			,"</tr></table>")
		return table.join("")
	}
	
	function CalbottomBar(args){// o
		function time(){
			table.push("<td>",CalTime(args.showTime),"</td>")
		}
		var table=["<table",TableCell," style='width:100%'><tr>"]
		if(args.showTime&&args.timePos=="left")
			time()
		if(args.bottomBar){
			table.push("<td><table",TableCell,"><tr><td>"
				,"<div dyc-btn='today' dyc-cls='hover-bottomBar-today,pressed-bottomBar-today' dyc-type='bottomBar-today' "
				,"class='DynarchCalendar-bottomBar-today'>"
				,_("today")
				,"</div>"
				,"</td></tr></table></td>")
		}
		if(args.showTime&&args.timePos=="right")
			time()
		table.push("</tr></table>")
		return table.join("")
	}
	
	function CalCreate(){//l
		var div=createElement("div")
		,els=this.els={}
		,event={
			mousedown:fapply(this,mouse_click,true)
			,mouseup:fapply(this,mouse_click,false)
			,mouseover:fapply(this,mouse_hover,true)
			,mouseout:fapply(this,mouse_hover,false)
			,keypress:fapply(this,key_shortcuts)
		}
		if(!this.args.noScroll)
			event[is_gecko?"DOMMouseScroll":"mouse_wheel"]=fapply(this,mouse_wheel)
		if(is_ie){
			event.dblclick=event.mousedown
			,event.keydown=event.keypress
		}
		div.innerHTML=CalBody.call(this)
		,setChild(div.firstChild,
			function(el){
				var clsName=CalClass[el.className]
				if(is_ie)
					el.setAttribute("unselectable","on")
				if(clsName)
					els[clsName]=el
		})
		,aEvent(els.main,event)
		,aEvent([els.focusLink,els.yearInput]
			,this._focusEvents={
				focus:fapply(this,CalFocus)
				,blur:fapply(this,CalsetBlurTimeout)
			}
		)
		,this.moveTo(this.date,false)
		,this.setTime(null,true)
		return els.topCont
	}
	
	function CalFocus(){//c
		if(this._bluringTimeout)
			clearTimeout(this._bluringTimeout)
		this.focused=true
		,aClass(this.els.main,"DynarchCalendar-focused")
		,this.callHooks("onFocus",this)
	}
	
	function CalBlur(){//h
		this.focused=false
		,rClass(this.els.main,"DynarchCalendar-focused")
		if(this._menuVisible)
			showMenu.call(this,false)
		if(!this.args.cont)
			this.hide()
		this.callHooks("onBlur",this)
	}
	
	function CalsetBlurTimeout(){//u
		this._bluringTimeout=setTimeout(fapply(this,CalBlur),50)
	}
	
	function timestep(attr){// d
		switch(attr){
			case"time-hour+":
				this.setHours(this.getHours()+1)
				break
			case"time-hour-":
				this.setHours(this.getHours()-1)
				break
			case"time-min+":
				this.setMinutes(this.getMinutes()+this.args.minuteStep)
				break
			case"time-min-":
				this.setMinutes(this.getMinutes()-this.args.minuteStep)
				break
			default:
				return
		}
	}
	
	function datestep(attr,n){// f
		if(this._bodyAnim)
			this._bodyAnim.stop()
		var date
		if(0!=attr){
			date=new Date(this.date)
			,date.setDate(1)
			switch(attr){
				case"-Y":
				case-2:
					date.setFullYear(date.getFullYear()-1)
					break
				case"+Y":
				case 2:
					date.setFullYear(date.getFullYear()+1)
					break
				case"-M":
				case-1:
					date.setMonth(date.getMonth()-1)
					break
				case"+M":
				case 1:
					date.setMonth(date.getMonth()+1)
					break
				default:
					return
			}
		}
		else 
			date=new Date
		return this.moveTo(date,!n)
	}
	
	function showMenu(mVis){// y
		var menu,mheight,tis=this
		this._menuVisible=mVis
		,ar_aClass(mVis,this.els.title,"DynarchCalendar-pressed-title")
		,menu=this.els.menu
		if(is_ie6)
			menu.style.height=this.els.main.offsetHeight+"px"
		if(this.args.animation){
			if(this._menuAnim)
				this._menuAnim.stop()
			,mheight=this.els.main.offsetHeight
			if(is_ie6)
				menu.style.width=this.els.topBar.offsetWidth+"px"
			if(mVis){
				menu.firstChild.style.marginTop=-mheight+"px"
				if(this.args.opacity>0){
					setOpacity(menu,0)
					,rdisplay(menu,true)
				}
			}
			this._menuAnim=CalAnimation({
				onUpdate:function(s,i){
					menu.firstChild.style.marginTop=i(mth.accel_b(s),-mheight,0,!mVis)+"px"
					,tis.args.opacity>0&&setOpacity(menu,i(mth.accel_b(s),0,.85,!mVis))
				}
				,onStop:function(){
					tis.args.opacity>0&&setOpacity(menu,.85)
					,menu.firstChild.style.marginTop=""
					,tis._menuAnim=null
					,mVis||(
						rdisplay(menu,false)
						,tis.focused&&tis.focus()
					)
				}
			})
		} else {
			rdisplay(menu,mVis)
			,this.focused&&this.focus()
		}
	}
	
	function mouse_click(bclick,event){//m
		var attr,timeout,attrbtn,attrtype,attrdate,sel,ev,attrcls,u
		event=event||window.event
		,attr=getAttribute(event)
		if(attr&&!attr.getAttribute("disabled")){
			attrbtn=attr.getAttribute("dyc-btn")
			,attrtype=attr.getAttribute("dyc-type")
			,attrdate=attr.getAttribute("dyc-date")
			,sel=this.selection
			,ev={
				mouseover:sEvent
				,mousemove:sEvent
				,mouseup:function(){
					var attrcls=attr.getAttribute("dyc-cls")
					if(attrcls)
						rClass(attr,CalSplit(attrcls,1))
					clearTimeout(timeout)
					,rEvent(document,ev,true)
					,ev=null
				}
			}
			if(bclick){
				setTimeout(fapply(this,this.focus),1)
				,attrcls=attr.getAttribute("dyc-cls")
				if(attrcls)
					aClass(attr,CalSplit(attrcls,1))
				if("menu"==attrbtn)
					this.toggleMenu()
				else if(attr&&/^[+-][MY]$/.test(attrbtn)){
					if(datestep.call(this,attrbtn)){
						u=fapply(
							this,
							function(){
								datestep.call(this,attrbtn,true)?timeout=setTimeout(u,40):(ev.mouseup(),datestep.call(this,attrbtn))
							})
						,timeout=setTimeout(u,350)
						,aEvent(document,ev,true)
					}
					else 
						ev.mouseup()
				}
				else if("year"==attrbtn){
					this.els.yearInput.focus()
					,this.els.yearInput.select()
				}
				else if("time-am"==attrtype)
					aEvent(document,ev,true)
				else if(/^time/.test(attrtype)){
					u=fapply(
						this,
						function(t){
							timestep.call(this,t)
							,timeout=setTimeout(u,100)
						}
						,attrtype
					)
					,timestep.call(this,attrtype)
					,timeout=setTimeout(u,350)
					,aEvent(document,ev,true)
				}
				else{
					if(attrdate&&sel.type){
						if(sel.type==Cal.SEL_MULTIPLE){
							if(event.shiftKey&&this._selRangeStart)
								sel.selectRange(this._selRangeStart,attrdate)
							else{
								event.ctrlKey||sel.isSelected(attrdate)||!this.args.multiCtrl||sel.clear(true)
								,sel.set(attrdate,true)
								,this._selRangeStart=attrdate
							}
						}else{
							sel.set(attrdate)
							,this.moveTo(intToDate(attrdate),2)
						}
						mouse_hover.call(this,true,{
							target:this._getDateDiv(attrdate)
						})
					}
					aEvent(document,ev,true)
				}
				if(is_ie&&ev&&/dbl/i.test(event.type))
					ev.mouseup()
				this.args.fixed||!/^(DynarchCalendar-(topBar|bottomBar|weekend|weekNumber|menu(-sep)?))?$/.test(attr.className)||this.args.cont||(
					ev.mousemove=fapply(this,CalDragIt)
					,this._mouseDiff=calDragItpos(event,getAbsolutePos(this.els.topCont))
					,aEvent(document,ev,true)
				)
			}else if("today"==attrbtn){
				if(!(this._menuVisible||sel.type!=Cal.SEL_SINGLE))
					sel.set(new Date)
				this.moveTo(new Date,true)
				,showMenu.call(this,false)
			}else if(/^m([0-9]+)/.test(attrbtn)){
				var date=new Date(this.date)
				date.setDate(1)
				,date.setMonth(RegExp.$1)
				,date.setFullYear(this._getInputYear())
				,this.moveTo(date,true)
				,showMenu.call(this,false)
			}else if("time-am"==attrtype)
				this.setHours(this.getHours()+12)
			if(is_ie)
				sEvent(event)
		}
	}
	
	function mouse_hover(b_io,event){//D
		var attr,attrtype,attrcls
		event=event||window.event
		,attr=getAttribute(event)
		if(attr){
			attrtype=attr.getAttribute("dyc-type")
			if(attrtype&&!attr.getAttribute("disabled")){
				if(!(b_io&&this._bodyAnim&&"date"==attrtype)){
					attrcls=attr.getAttribute("dyc-cls")
					,attrcls=attrcls?CalSplit(attrcls,0):"DynarchCalendar-hover-"+attrtype
					if("date"!=attrtype||this.selection.type)
						ar_aClass(b_io,attr,attrcls)
					if("date"==attrtype){
						ar_aClass(b_io,attr.parentNode.parentNode,"DynarchCalendar-hover-week")
						,this._showTooltip(attr.getAttribute("dyc-date"))
					}
					else if(/^time-hour/.test(attrtype))
						ar_aClass(b_io,this.els.timeHour,"DynarchCalendar-hover-time")
					else if(/^time-min/.test(attrtype))
						ar_aClass(b_io,this.els.timeMinute,"DynarchCalendar-hover-time")
					rClass(this._getDateDiv(this._lastHoverDate),"DynarchCalendar-hover-date")
					,this._lastHoverDate=null
				}
			}
		}
		if(!b_io)
			this._showTooltip()
	}
	
	function mouse_wheel(event){// b
		var attr,attrbtn,atttype,wheel
		event=event||window.event
		if(attr=getAttribute(event)){
			attrbtn=attr.getAttribute("dyc-btn")
			,atttype=attr.getAttribute("dyc-type")
			,wheel=event.wheelDelta?event.wheelDelta/120:-event.detail/3
			,wheel=0>wheel?-1:wheel>0?1:0
			if(this.args.reverseWheel)
				wheel=-wheel
			if(/^(time-(hour|min))/.test(atttype)){
					switch(RegExp.$1){
						case"time-hour":
							this.setHours(this.getHours()+wheel)
						break
						case"time-min":
							this.setMinutes(this.getMinutes()+this.args.minuteStep*wheel)
						break
					}
					sEvent(event)
				}
			else {
				if(/Y/i.test(attrbtn))
					wheel*=2
				datestep.call(this,-wheel)
				,sEvent(event)
			}
		}
			
				
	}
	
	function inputField(){// C
		var field,sel,print
		this.refresh()
		,field=this.inputField
		,sel=this.selection
		if(field){
			print=sel.print(this.dateFormat)
			,/input|textarea/i.test(field.tagName)?field.value=print:field.innerHTML=print
		}
		this.callHooks("onSelect",this,sel)
	}
	
	function key_shortcuts(event){//w
		var el,attrbtn,kc,cc,r,date,yinput,sel,month,monthname,setmonth,im,bdate
		if(!this._menuAnim){
			event=event||window.event
			,el=event.target||event.srcElement
			,attrbtn=el.getAttribute("dyc-btn")
			,kc=event.keyCode
			,cc=event.charCode||kc
			,r=KCee[kc]
			if("year"==attrbtn&&13==kc){
				date=new Date(this.date)
				,date.setDate(1)
				,date.setFullYear(this._getInputYear())
				,this.moveTo(date,true)
				,showMenu.call(this,false)
				return sEvent(event)
			}else if(this._menuVisible){
				if(27==kc)
					showMenu.call(this,false)
					return sEvent(event)
			}else{
				event.ctrlKey||(r=null)
				,null!=r||event.ctrlKey||(r=KCne[kc])
				,36==kc&&(r=0)
				cc=String.fromCharCode(cc).toLowerCase()
				,yinput=this.els.yearInput
				,sel=this.selection
				monthname=_("mn")
				,setmonth=event.shiftKey?-1:this.date.getMonth()
				for(im=0;++im<12;){
					month=monthname[(setmonth+im)%12].toLowerCase()
					if(month.indexOf(cc)==0){
						date=new Date(this.date)
						,date.setDate(1)
						,date.setMonth((setmonth+im)%12)
						,this.moveTo(date,true)
						return sEvent(event)
					}
				}
				if(null!=r){
					datestep.call(this,r)
					return sEvent(event)
				}else if(" "==cc){
					showMenu.call(this,true)
					,this.focus()
					,yinput.focus()
					,yinput.select()
					return sEvent(event)
				}else if(cc>="0"&&"9">=cc){
					showMenu.call(this,true)
					,this.focus()
					,yinput.value=cc
					,yinput.focus()
					return sEvent(event)
				}else if(kc>=37&&40>=kc){
					date=this._lastHoverDate
					if(!(date||sel.isEmpty())){
						date=39>kc?sel.getFirstDate():sel.getLastDate()
						if(date<this._firstDateVisible||date>this._lastDateVisible)
							date=null
					}
					if(date){
						bdate=date
						,date=intToDate(date)
						for(var ikc=100;ikc-->0;){
							switch(kc){
								case 37:
									date.setDate(date.getDate()-1)
								break
								case 38:
									date.setDate(date.getDate()-7)
								break
								case 39:
									date.setDate(date.getDate()+1)
								break
								case 40:
									date.setDate(date.getDate()+7)
							}
							if(!this.isDisabled(date))
								break
						}
						date=dateToInt(date)
						,(date<this._firstDateVisible||date>this._lastDateVisible)&&this.moveTo(date)
					}else{
						date=39>kc?this._lastDateVisible:this._firstDateVisible
					}
						rClass(this._getDateDiv(bdate),aClass(this._getDateDiv(date),"DynarchCalendar-hover-date"))
						,this._lastHoverDate=date
						return sEvent(event)
				}else if(13==kc&&this._lastHoverDate){
					if(sel.type==t.SEL_MULTIPLE&&(event.shiftKey||event.ctrlKey)){
						if(event.shiftKey&&this._selRangeStart){
							sel.clear(true)
							,sel.selectRange(this._selRangeStart,this._lastHoverDate)
						}
						if(event.ctrlKey)
							sel.set(this._selRangeStart=this._lastHoverDate,true)
					}else 
						sel.reset(this._selRangeStart=this._lastHoverDate)
					return sEvent(event)
				}
				27!=kc||this.args.cont||this.hide()
			}
		}
	}
	
	function kcmonth(t){//keyCodeMonth I
		function e(e){
			for(var n=e.length;--n>=0;)
				if(e[n].toLowerCase().indexOf(t)==0)
					return n+1
		}
		return/\S/.test(t)?(t=t.toLowerCase(),e(_("smn"))||e(_("mn"))):void 0
	}
	
	function _(name,e){//i18n
		var data=CalI18N.__.data[name]
		if(e&&"string"==typeof data)
			data=formatString(data,e)
		return data
	}
	
	function weekOfYear(date){//woy T
		var dow,ts
		date=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12,0,0)
		,dow=date.getDay()
		,date.setDate(date.getDate()-(dow+6)%7+3)
		,ts=date.valueOf()
		,date.setMonth(0)
		,date.setDate(4)
		return Math.round((ts-date.valueOf())/6048e5)+1
	}
	
	function dayOfYear(date){//doy x
		var jan1date,ts
		date=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12,0,0)
		,jan1date=new Date(date.getFullYear(),0,1,12,0,0)
		,ts=date-jan1date
		return Math.floor(ts/864e5)
	}
	
	function dateDiff(date,date2,difday){// H
		var year=date.getFullYear()
		,month=date.getMonth()
		,day=date.getDate()
		,year2=date2.getFullYear()
		,month2=date2.getMonth()
		,day2=date2.getDate()
		if(year2>year)return -3
		else if(year>year2)return 3
		else if(month2>month)return -2
		else if(month>month2)return 2
		else if(difday)return 0
		else if(day2>day)return -1
		else if(day>day2)return 1
		else return 0
	}
	
	function printDate(date,e){//S
		var obj
		,mon=date.getMonth()
		,day=date.getDate()
		,year=date.getFullYear()
		,woy=weekOfYear(date)
		,dow=date.getDay()
		,h24=date.getHours()
		,pam=h24>=12
		,h12=pam?h24-12:h24
		,doy=dayOfYear(date)
		,min=date.getMinutes()
		,sec=date.getSeconds()
		,y=/%./g
		0===h12&&(h12=12)
		,obj={
			"%a":_("sdn")[dow]
			,"%A":_("dn")[dow]
			,"%b":_("smn")[mon]
			,"%B":_("mn")[mon]
			,"%C":1+Math.floor(year/100)
			,"%d":10>day?"0"+day:day
			,"%e":day
			,"%H":10>h24?"0"+h24:h24
			,"%I":10>h12?"0"+h12:h12
			,"%j":10>doy?"00"+doy:100>doy?"0"+doy:doy
			,"%k":h24
			,"%l":h12
			,"%m":9>mon?"0"+(1+mon):1+mon
			,"%o":1+mon
			,"%M":10>min?"0"+min:min
			,"%n":"\n"
			,"%p":pam?"PM":"AM"
			,"%P":pam?"pm":"am"
			,"%s":Math.floor(date.getTime()/1e3)
			,"%S":10>sec?"0"+sec:sec
			,"%t":"	"
			,"%U":10>woy?"0"+woy:woy
			,"%W":10>woy?"0"+woy:woy
			,"%V":10>woy?"0"+woy:woy
			,"%u":dow+1
			,"%w":dow
			,"%y":(""+year).substr(2,2)
			,"%Y":year
			,"%%":"%"
		}
		return e.replace(y,function(t){return obj.hasOwnProperty(t)?obj[t]:t})
	}
	
	function formatString(str,e){//M
		return str.replace(/\$\{([^:\}]+)(:[^\}]+)?\}/g
			,function(t,n,a){
				var s,i=e[n]
				if(a){
					s=a.substr(1).split(/\s*\|\s*/)
					,i=(i<s.length?s[i]:s[s.length-1]).replace(/##?/g
						,function(t){
							return t.length==2?"#":i
						}
					)
				}
				return i
			}
		)
	}
	
	function isToDate(date){//k
		if(date){
			if("number"==typeof date)
				return intToDate(date)
			if(!(date instanceof Date)){
				var date=date.split(/-/)
				return new Date(parseInt(date[0],10),parseInt(date[1],10)-1,parseInt(date[2],10),12,0,0,0)
			}
		}
		return date
	}
	function dateToInt(date){//L
		if(date instanceof Date)
			return 1e4*date.getFullYear()+100*(date.getMonth()+1)+date.getDate()
		else if("string"==typeof date)
			return parseInt(date,10)
		else 
			return date
	}
	
	function intToDate(date,hours,minutes,seconds,milliseconds){//A
		var year,month
		if(!(date instanceof Date)){
			date=parseInt(date,10)
			,year=Math.floor(date/1e4)
			,date%=1e4
			,month=Math.floor(date/100)
			,date%=100
			,date=new Date(year,month-1,date,null==hours?12:hours,null==minutes?0:minutes,null==seconds?0:seconds,null==milliseconds?0:milliseconds)
		}
		return date
	}
	
	
	function setArgs(sargs,dargs,iarg,args){//E
		args={}
		for(iarg in dargs)
			if(dargs.hasOwnProperty(iarg))
				args[iarg]=dargs[iarg]
		for(iarg in sargs)
			if(sargs.hasOwnProperty(iarg))
				args[iarg]=sargs[iarg]
		return args
	}
	
	function aEvent(el,type,callback,a){//addEvent  B
		var i
		if(el instanceof Array){
			for(i=el.length;--i>=0;)
				aEvent(el[i],type,callback,a)
		}else if("object"==typeof type){
			for(i in type)
				if(type.hasOwnProperty(i))
					aEvent(el,i,type[i],callback)
		}else{
			if(el.addEventListener)
				el.addEventListener(type,callback,is_ie?true:!!a)
			else if(el.attachEvent)
				el.attachEvent("on"+type,callback)
			else
				el["on"+type]=callback
		}
	}
	
	function rEvent(el,type,callback,a){//removeEvent   F
		var s
		if(el instanceof Array){
			for(s=el.length;--s>=0;)
				rEvent(el[s],type,callback)
		}else if("object"==typeof type){
			for(s in type)
				if(type.hasOwnProperty(s))
					rEvent(el,s,type[s],callback)
		}else{
			if(el.removeEventListener)
				el.removeEventListener(type,callback,is_ie?true:!!a)
			else if(el.detachEvent)
				el.detachEvent("on"+type,callback)
			else
				el["on"+type]=null
		}
	}
	
	function sEvent(event){//stopEvent   N
		event=event||window.event
		if(is_ie){
			event.cancelBubble=true
			,event.returnValue=false
		}else{
			event.preventDefault()
			,event.stopPropagation()
		}
		return false
	}
	
	function rClass(el,rclassName,aclassName){// removeClass Y
		if(el){
			var i
			,cls=el.className.replace(/^\s+|\s+$/,"").split(/\x20/)
			,arcls=[]
			for(i=cls.length;i>0;)
				if(cls[--i]!=rclassName)
					arcls.push(cls[i])
			if(aclassName)
				arcls.push(aclassName)
			el.className=arcls.join(" ")
		}
		return aclassName
	}
	
	function aClass(el,className){// addClass P
		return rClass(el,className,className)
	}
	
	function ar_aClass(t,el,className){// array_addCalss R
		if(el instanceof Array)
			for(var i=el.length;--i>=0;)
				ar_aClass(t,el[i],className)
		else 
			rClass(el,className,t?className:null)
		return t
	}
	
	function createElement(elName,clsName,childName){//V
		var el=null
		el=document.createElementNS?document.createElementNS("http://www.w3.org/1999/xhtml",elName):document.createElement(elName)
		if(clsName)
			el.className=clsName
		if(childName)
			childName.appendChild(el)
		return el
	}
	
	function setFanc(str,rfunc,i){//q
		for(i=0;i<str.length;++i)
			rfunc(str[i])
	}
	
	function getElementById(id){//J
		"string"==typeof id&&(id=document.getElementById(id))
		return id
	}
	
	function getAttribute(attr){// g
		var el=attr.target||attr.srcElement
		bel=el
		while(el&&el.getAttribute&&!el.getAttribute("dyc-type"))
			el=el.parentNode
		return el.getAttribute&&el||bel
	}
	
	function CalSplit(str,i){// v
		return"DynarchCalendar-"+str.split(/,/)[i]
	}
	
	function objSlice(args,begin){// array-like objects
		var list
		if(null==begin)
			begin=0
		try{// Can't be used with DOM elements in IE < 9
			list=Array.prototype.slice.call(args,begin)
		}catch(i){// Fails in IE < 9
			list=new Array(args.length-begin)
			var tb=begin
			for(var i=0;tb<args.length;++tb,++i)
				list[i]=args[tb]
		}
		return list
	}
	
	function fapply(tis,func){
		var slice=objSlice(arguments,2)
		return function(){
			return func.apply(tis,slice.concat(objSlice(arguments)))
		}
	}
	
	function setChild(node,callback){//W
		if(!callback(node)){
			for(var child=node.firstChild;child;child=child.nextSibling)
				if(child.nodeType==1)
					setChild(child,callback)
		}
	}
	
	function CalAnimation(args,e,n){//K
		function m(t,e,n,a){//map
			return a?n+t*(e-n):e+t*(n-e)
		}
		function st(){//start
			e&&sp()
			,n=0
			,e=setInterval(u,1e3/args.fps)
		}
		function sp(){//stop
			e&&(clearInterval(e),e=null)
			,args.onStop(n/args.len,m)
		}
		function u(){//update
			var e=args.len
			args.onUpdate(n/e,m)
			,n==e&&sp()
			,++n
		}
		args=setArgs(args,{fps:50,len:15,onUpdate:func,onStop:func})
		if(is_ie)
			args.len=Math.round(args.len/2)
		st()
		return {start:st,stop:sp,update:u,args:args,map:m}
	}
	
	function setOpacity(el,e){//setOpacity
		if(""===e){
			if(is_ie)
				el.style.filter=""
			else
				el.style.opacity=""
		}else if(null!=e){
			if(is_ie)
				el.style.filter="alpha(opacity="+100*e+")"
			else
				el.style.opacity=e
		}else if(is_ie){
			if(/alpha\(opacity=([0-9.])+\)/.test(el.style.opacity))
				e=parseFloat(RegExp.$1)/100
			else
				e=parseFloat(el.style.opacity)
		}
		return e
	}
	
	function rdisplay(el,display){//j
		var style=el.style
		if(null!=display)
			style.display=display?"":"none"
		return style.display!="none"
	}
	
	function CalDragIt(event){// p
		event=event||window.event
		var style=this.els.topCont.style
		,pos=calDragItpos(event,this._mouseDiff)
		style.left=pos.x+"px"
		,style.top=pos.y+"px"
	}
	
	function calDragItpos(event,cal){// z
		var px=is_ie?event.clientX+document.body.scrollLeft:event.pageX
		,py=is_ie?event.clientY+document.body.scrollTop:event.pageY
		if(cal){
			px-=cal.x
			,py-=cal.y
		}
		return {x:px,y:py}
	}
	
	function getAbsolutePos(el){//G
		var e,sl,st
		if(el.getBoundingClientRect)
			return e=el.getBoundingClientRect()
				,{
					x:e.left-document.documentElement.clientLeft+document.body.scrollLeft
					,y:e.top-document.documentElement.clientTop+document.body.scrollTop
				}
		sl=0
		,st=0
		do 
			sl+=el.offsetLeft-el.scrollLeft
			,st+=el.offsetTop-el.scrollTop
		while(el=el.offsetParent)
		return {x:sl,x:st}
	}
	
	function posScrol(){//X
		var docel=document.documentElement
		,docbody=document.body
		return{
			x:docel.scrollLeft||docbody.scrollLeft
			,y:docel.scrollTop||docbody.scrollTop
			,w:docel.clientWidth||window.innerWidth||docbody.clientWidth
			,h:docel.clientHeight||window.innerHeight||docbody.clientHeight
		}
	}
	
	var TableCell,CalClass,CalBNF,KCee,KCne,mth,func
	,userAgent=navigator.userAgent
	,is_opera=/opera/i.test(userAgent)
	,is_khtml=/Konqueror|Safari|KHTML/i.test(userAgent)
	,is_ie=/msie/i.test(userAgent)&&!is_opera&&!/mac_powerpc/i.test(userAgent)
	,is_ie6=is_ie&&/msie 6/i.test(userAgent)
	,is_gecko=/gecko/i.test(userAgent)&&!is_khtml&&!is_opera&&!is_ie
	,CalI18N=Cal.I18N={}
	,CalPrototype=Cal.prototype
	,TableCell=" align='center' cellspacing='0' cellpadding='0'"
	,CalClass={
		"DynarchCalendar-topCont":"topCont"
		,"DynarchCalendar-focusLink":"focusLink"
		,DynarchCalendar:"main"
		,"DynarchCalendar-topBar":"topBar"
		,"DynarchCalendar-title":"title"
		,"DynarchCalendar-dayNames":"dayNames"
		,"DynarchCalendar-body":"body"
		,"DynarchCalendar-menu":"menu"
		,"DynarchCalendar-menu-year":"yearInput"
		,"DynarchCalendar-bottomBar":"bottomBar"
		,"DynarchCalendar-tooltip":"tooltip"
		,"DynarchCalendar-time-hour":"timeHour"
		,"DynarchCalendar-time-minute":"timeMinute"
		,"DynarchCalendar-time-am":"timeAM"
		,"DynarchCalendar-navBtn DynarchCalendar-prevYear":"navPrevYear"
		,"DynarchCalendar-navBtn DynarchCalendar-nextYear":"navNextYear"
		,"DynarchCalendar-navBtn DynarchCalendar-prevMonth":"navPrevMonth"
		,"DynarchCalendar-navBtn DynarchCalendar-nextMonth":"navNextMonth"
	}
	,CalBNF={
		"-3":"backYear"
		,"-2":"back"
		,0:"now"
		,2:"fwd"
		,3:"fwdYear"
	}
	,KCee={
		37:-1
		,38:-2
		,39:1
		,40:2
	}
	,KCne={
		33:-1
		,34:1
	}
	
	Cal.SEL_NONE=0
	,Cal.SEL_SINGLE=1
	,Cal.SEL_MULTIPLE=2
	,Cal.SEL_WEEK=3
	,Cal.dateToInt=dateToInt
	,Cal.intToDate=intToDate
	,Cal.printDate=printDate
	,Cal.formatString=formatString
	,Cal.i18n=_
	,func=Function()
	,Cal.LANG=function(lang,nm,dt){
		CalI18N.__=CalI18N[lang]={
			name:nm
			,data:dt
		}
	}
	,Cal.setup=function(args){
		return new Cal(args)
	}
	,CalPrototype.moveTo=function(tdate,e){
		var a,s,args,min,max,body,animBody,fchild,u,d,f,y,m,p,g,v,tis=this
		tdate=isToDate(tdate)
		,s=dateDiff(tdate,this.date,true)
		,args=this.args
		if(min=args.min)
			dateDiff(tdate,args.min)
		if(max=args.max)
			dateDiff(tdate,args.max)
		if(!args.animation)
			e=false
		ar_aClass(
			null!=min&&1>=min
			,[this.els.navPrevMonth,this.els.navPrevYear]
			,"DynarchCalendar-navDisabled"
		)
		,ar_aClass(
			null!=max&&max>=-1
			,[this.els.navNextMonth,this.els.navNextYear]
			,"DynarchCalendar-navDisabled"
		)
		if(-1>min){
			tdate=args.min
			,a=1
			,s=0
		}
		if(max>1){
			tdate=args.max
			,a=2
			,s=0
		}
		this.date=tdate
		,this.refresh(!!e)
		,this.callHooks("onChange",this,tdate,e)
		,!e||0==s&&2==e||(
			this._bodyAnim&&this._bodyAnim.stop()
			,body=this.els.body
			,animBody=createElement("div","DynarchCalendar-animBody-"+CalBNF[s],body)
			,fchild=body.firstChild
			,setOpacity(fchild)||.7
			,u=a?mth.brakes:0==s?mth.shake:mth.accel_ab2
			,d=s*s>4
			,f=d?fchild.offsetTop:fchild.offsetLeft
			,y=animBody.style
			,m=d?body.offsetHeight:body.offsetWidth
			,0>s?m+=f:s>0?m=f-m:(m=Math.round(m/7),2==a&&(m=-m))
			,a||0==s||(
				p=animBody.cloneNode(true)
				,g=p.style
				,v=2*m
				,p.appendChild(fchild.cloneNode(true))
				,g[d?"marginTop":"marginLeft"]=m+"px"
				,body.appendChild(p)
			)
			,fchild.style.visibility="hidden"
			,animBody.innerHTML=CalDay.call(this)
			,this._bodyAnim=CalAnimation({
				onUpdate:function(t,e){
					var n
					,i=u(t)
					p&&(n=e(i,m,v)+"px")
					,a?y[d?"marginTop":"marginLeft"]=e(i,m,0)+"px":((d||0==s)&&(y.marginTop=e(0==s?u(t*t):i,0,m)+"px",0!=s&&(g.marginTop=n)),d&&0!=s||(y.marginLeft=e(i,0,m)+"px",0!=s&&(g.marginLeft=n)))
					,tis.args.opacity>2&&p&&(setOpacity(p,1-i),setOpacity(animBody,i))
				}
				,onStop:function(){
					body.innerHTML=CalDay.call(tis,tdate),tis._bodyAnim=null
				}
			})
		)
		this._lastHoverDate=null
		return min>=-1&&1>=max
	}
	
	,CalPrototype.isDisabled=function(t){
		var args=this.args
		return args.min&&dateDiff(t,args.min)<0||args.max&&dateDiff(t,args.max)>0||args.disabled(t)
	}
	
	,CalPrototype.toggleMenu=function(){
		showMenu.call(this,!this._menuVisible)
	}
	
	,CalPrototype.refresh=function(t){
		var els=this.els
		if(!t)
			els.body.innerHTML=CalDay.call(this)
		els.title.innerHTML=CalTitle(this.date,this.args.titleFormat)
		,els.yearInput.value=this.date.getFullYear()
	}
	
	,CalPrototype.redraw=function(){
		var els=this.els
		this.refresh()
		,els.dayNames.innerHTML=CalWeeks(this.args.weekNumbers,this.fdow)
		,els.menu.innerHTML=CalMenu(this.date.getFullYear())
		if(els.bottomBar)
			els.bottomBar.innerHTML=CalbottomBar(this.args)
		setChild(
			els.topCont
			,function(el){
				var cls=CalClass[el.className]
				if(cls)
					els[cls]=el
				if(el.className=="DynarchCalendar-menu-year"){
					aEvent(el,this._focusEvents)
					,els.yearInput=el
				}
				else if(is_ie)
					el.setAttribute("unselectable","on")
			}
		)
		,this.setTime(null,true)
	}
	
	,CalPrototype.setLanguage=function(Lang){
		var Lang=Cal.setLanguage(Lang)
		if(Lang){
			this.fdow=Lang.data.fdow
			,this.redraw()
		}
	}
	
	,Cal.setLanguage=function(Lang){
		var I18N=CalI18N[Lang]
		if(I18N)
			CalI18N.__=I18N
		return I18N
	}
	
	,CalPrototype.focus=function(){
		try{
			this.els[this._menuVisible?"yearInput":"focusLink"].focus()
		}catch(Cal){}
		CalFocus.call(this)
	}
	
	,CalPrototype.blur=function(){
		this.els.focusLink.blur()
		,this.els.yearInput.blur()
		,CalBlur.call(this)
	}
	
	,CalPrototype.showAt=function(lpos,tpos,banim){
		if(this._showAnim)
			this._showAnim.stop()
		,banim=banim&&this.args.animation
		var topCont=this.els.topCont
		,firstChild=this.els.body.firstChild
		,offsetHeight=firstChild.offsetHeight
		,tcstyle=topCont.style
		,tis=this
		tcstyle.position="absolute"
		,tcstyle.left=lpos+"px"
		,tcstyle.top=tpos+"px"
		,tcstyle.zIndex=1e4
		,tcstyle.display=""
		if(banim){
			firstChild.style.marginTop=-offsetHeight+"px"
			if(this.args.opacity>1)
				setOpacity(topCont,0)
			,this._showAnim=CalAnimation({
				onUpdate:function(t,e){
					firstChild.style.marginTop=-e(mth.accel_b(t),offsetHeight,0)+"px"
					,tis.args.opacity>1&&setOpacity(topCont,t)
				}
				,onStop:function(){
					tis.args.opacity>1&&setOpacity(topCont,"")
					,tis._showAnim=null
				}
			})
		}
	}
	
	,CalPrototype.hide=function(){
		this.callHooks("onClose",this)
		var topCont=this.els.topCont
		,firstChild=this.els.body.firstChild
		,offsetHeight=firstChild.offsetHeight
		,s=getAbsolutePos(topCont).y
		,tis=this
		if(this.args.animation){
			if(this._showAnim)
				this._showAnim.stop()
			this._showAnim=CalAnimation({
				onUpdate:function(i,r){
					if(tis.args.opacity>1)
						setOpacity(topCont,1-i)
					firstChild.style.marginTop=-r(mth.accel_b(i),0,offsetHeight)+"px"
					,topCont.style.top=r(mth.accel_ab(i),s,s-10)+"px"
				}
				,onStop:function(){
					topCont.style.display="none"
					,firstChild.style.marginTop=""
					if(tis.args.opacity>1)
						setOpacity(topCont,"")
					tis._showAnim=null
				}
			})
		}else
			topCont.style.display="none"
		this.inputField=null
	}
	
	,CalPrototype.popup=function(trigger,align){
		function alignment(align){
			var pos={x:l.x,y:l.y}
			if(align){
				// vertical alignment
				if(/B/.test(align))
					pos.y+=trigger.offsetHeight
				if(/b/.test(align))
					pos.y+=trigger.offsetHeight-tcpos.y
				if(/T/.test(align))
					pos.y-=tcpos.y
				if(/m/i.test(align))
					pos.y+=(trigger.offsetHeight-tcpos.y)/2
				// horizontal alignment
				if(/l/.test(align))
					pos.x-=tcpos.x-trigger.offsetWidth
				if(/L/.test(align))
					pos.x-=tcpos.x
				if(/R/.test(align))
					pos.x+=trigger.offsetWidth
				if(/c/i.test(align))
					pos.x+=(trigger.offsetWidth-tcpos.x)/2
				return pos
			}else
				return pos
		}
		var tcpos,postrigger,topCont,tcstyle,poscrol,l
		this.showAt(0,0)
		,topCont=this.els.topCont
		,tcstyle=topCont.style
		,tcstyle.visibility="hidden"
		,tcstyle.display=""
		,document.body.appendChild(topCont)
		,tcpos={
			x:topCont.offsetWidth
			,y:topCont.offsetHeight
		}
		trigger=getElementById(trigger)
		,postrigger=getAbsolutePos(trigger)
		,l=postrigger
		if(!align)
			align=this.args.align
		align=align.split(/\x2f/)
		,l=alignment(align[0])
		,poscrol=posScrol()
		if(l.y<poscrol.y){
			l.y=postrigger.y
			,l=alignment(align[1])
		}
		if(l.x+tcpos.x>poscrol.x+poscrol.w){
			l.x=postrigger.x
			,l=alignment(align[2])
		}
		if(l.y+tcpos.y>poscrol.y+poscrol.h){
			l.y=postrigger.y
			,l=alignment(align[3])
		}
		if(l.x<poscrol.x){
			l.x=postrigger.x
			,l=alignment(align[4])
		}
		this.showAt(l.x,l.y,true)
		,tcstyle.visibility=""
		,this.focus()
	}
	
	,CalPrototype.popupForField=function(trigger,field,dateFormat){
		var s,i,r,o
		field=getElementById(field)
		,trigger=getElementById(trigger)
		,this.inputField=field
		,this.dateFormat=dateFormat
		if(this.selection.type==Cal.SEL_SINGLE){
			s=/input|textarea/i.test(field.tagName)?field.value:field.innerText||field.textContent
			if(s){
				i=/(^|[^%])%[bBmo]/.exec(dateFormat)
				,r=/(^|[^%])%[de]/.exec(dateFormat)
				if(i&&r)
					o=i.index<r.index
				,s=Calendar.parseDate(s,o)
				if(s){
					this.selection.set(s,false,true)
					if(this.args.showTime){
						this.setHours(s.getHours())
						,this.setMinutes(s.getMinutes())
					}
					this.moveTo(s)
				}
			}
		}
		this.popup(trigger)
	}
	
	,CalPrototype.manageFields=function(trigger,field,dateFormat){
		var tis=this
		field=getElementById(field)
		,trigger=getElementById(trigger)
		if(/^button$/i.test(trigger.tagName))
			trigger.setAttribute("type","button")
		aEvent(trigger,"click"
			,function(s){
				tis.popupForField(trigger,field,dateFormat)
				return sEvent(s)
			}
		)
	}
	
	,CalPrototype.callHooks=function(type){
		var e=objSlice(arguments,1)
		,stack=this.listeners[type]
		for(var i=0;i<stack.length;++i)
			stack[i].apply(this,e)
	}
	
	,CalPrototype.addEventListener=function(type,callback){
		this.listeners[type].push(callback)
	}
	
	,CalPrototype.removeEventListener=function(type,callback){
		for(var stack=this.listeners[type],i=stack.length;--i>=0;)
			stack[i]===callback&&stack.splice(i,1)
	}
	
	,CalPrototype.getTime=function(){
		return this.time
	}
	
	,CalPrototype.setTime=function(time,e){
		var hour,minute,timeAM,field,sel,print
		if(this.args.showTime){
			time=null!=time?time:this.time
			,this.time=time
			,hour=this.getHours()
			,minute=this.getMinutes()
			,timeAM=12>hour
			if(this.args.showTime==12){
				0==hour&&(hour=12)
				,hour>12&&(hour-=12)
				,this.els.timeAM.innerHTML=_(timeAM?"AM":"PM")
			}
			if(10>hour)
				hour="0"+hour
			if(10>minute)
				minute="0"+minute
			this.els.timeHour.innerHTML=hour
			,this.els.timeMinute.innerHTML=minute
			if(!e){
				this.callHooks("onTimeChange",this,time)
				,field=this.inputField
				,sel=this.selection
				if(field){
					print=sel.print(this.dateFormat)
					,/input|textarea/i.test(field.tagName)?field.value=print:field.innerHTML=print
				}
			}
		}
	}
	
	,CalPrototype.getHours=function(){
		return Math.floor(this.time/100)
	}
	
	,CalPrototype.getMinutes=function(){
		return this.time%100
	}
	
	,CalPrototype.setHours=function(hour){
		if(0>hour)
			hour+=24
		this.setTime(100*(hour%24)+this.time%100)
	}
	
	,CalPrototype.setMinutes=function(min){
		if(0>min)
			min+=60
		min=Math.floor(min/this.args.minuteStep)*this.args.minuteStep
		,this.setTime(100*this.getHours()+min%60)
	}
	
	,CalPrototype._getInputYear=function(){
		var yearInput=parseInt(this.els.yearInput.value,10)
		if(isNaN(yearInput))
			yearInput=this.date.getFullYear()
		return yearInput
	}
	
	,CalPrototype._showTooltip=function(tdate){
		var dateInfo
		,div=""
		,tooltip=this.els.tooltip
		if(tdate){
			tdate=intToDate(tdate)
			,dateInfo=this.args.dateInfo(tdate)
			if(dateInfo&&dateInfo.tooltip)
				div="<div class='DynarchCalendar-tooltipCont'>"+printDate(tdate,dateInfo.tooltip)+"</div>"
		}
		tooltip.innerHTML=div
	}
	
	,CalPrototype._getDateDiv=function(t){
		var e=null
		if(t)
			try{
				setChild(this.els.body,function(el){if(el.getAttribute("dyc-date")==t)throw e=el})
			}catch(n){}
		return e
	}
	
	,(Cal.Selection=function(sel,type,field,tis){
		this.type=type
		,this.sel=sel instanceof Array?sel:[sel]
		,this.onChange=fapply(tis,field)
		,this.cal=tis
	}).prototype={
		
		get:function(){
			return this.type==Cal.SEL_SINGLE?this.sel[0]:this.sel
		}
		
		,isEmpty:function(){
			return this.sel.length==0
		}
		
		,set:function(e,n,a){
			var sel_single=this.type==Cal.SEL_SINGLE
			if(e instanceof Array){
				this.sel=e
				,this.normalize()
				if(!a)
					this.onChange(this)
			}else{
				e=dateToInt(e)
				if(sel_single||!this.isSelected(e)){
					if(sel_single)
						this.sel=[e]
					else
						this.sel.splice(this.findInsertPos(e),0,e)
					this.normalize()
					if(!a)
						this.onChange(this)
				}else if(n)
					this.unselect(e,a)
			}
		}
	
		,reset:function(){
			this.sel=[]
			,this.set.apply(this,arguments)
		}
	
		,countDays:function(){
			var date,sdate,edate
			,count=0
			,sel=this.sel
			for(i=sel.length;--i>=0;++count){
				date=sel[i]
				if(date instanceof Array){
					sdate=intToDate(date[0])
					,edate=intToDate(date[1])
					,count+=Math.round(Math.abs(edate.getTime()-sdate.getTime())/864e5)
				}
			}
			return count
		}
		
		,unselect:function(t,e){
			var n,a,s,i,r,o,l
			t=dateToInt(t)
			,n=false
			,s=this.sel
			for(i=s.length;--i>=0;){
				a=s[i]
				,a instanceof Array?
					t<a[0]||t>a[1]||(
						r=intToDate(t)
						,o=r.getDate()
						,t==a[0]?(
							r.setDate(o+1)
							,a[0]=dateToInt(r)
							,n=true
						)
						:
						t==a[1]?(
							r.setDate(o-1)
							,a[1]=dateToInt(r)
							,n=true
						)
						:
						(
							l=new Date(r)
							,l.setDate(o+1)
							,r.setDate(o-1)
							,s.splice(i+1,0,[dateToInt(l),a[1]])
							,a[1]=dateToInt(r)
							,n=true
						)
					)
					:
					t==a&&(s.splice(i,1),n=true)
			}
			n&&(
				this.normalize()
				,e||this.onChange(this)
			)
		}
	
		,normalize:function(){
			var t,e,sel,slen,s,i,r
			this.sel=this.sel.sort(
				function(t,e){
					 if(t instanceof Array)
						 t=t[0]
					if(e instanceof Array)
						e=e[0]
					return t-e
				}
			)
			,sel=this.sel
			,slen=sel.length
			for(;--slen>=0;){
				t=sel[slen]
				if(t instanceof Array){
					if(t[0]>t[1]){
						sel.splice(slen,1)
						continue
					}
					if(t[0]==t[1])
						t=sel[slen]=t[0]
				}
				e&&(
					s=e
					,i=t instanceof Array?
						t[1]
						:
						t
					,i=intToDate(i)
					,i.setDate(i.getDate()+1)
					,i=dateToInt(i)
					,s>i||(
						r=sel[slen+1]
						,t instanceof Array&&r instanceof Array?(
							t[1]=r[1]
							,sel.splice(slen+1,1)
						)
						:
						t instanceof Array?(
							t[1]=e
							,sel.splice(slen+1,1)
						)
						:
						r instanceof Array?(
							r[0]=t
							,sel.splice(slen,1)
						)
						:
						(
							sel[slen]=[t,r]
							,sel.splice(slen+1,1)
						)
					)
				)
				,e=t instanceof Array?t[0]:t
			}
		}
	
		,findInsertPos:function(t){
			var e
			,sel=this.sel
			,slen=sel.length
			for(;--slen>=0&&(e=sel[slen],e instanceof Array&&(e=e[0]),t<e););
			return slen+1
		}
	
		,clear:function(t){
			this.sel=[]
			if(!t)
				this.onChange(this)
		}
	
		,selectRange:function(e,n){
			var a,s
			e=dateToInt(e)
			,n=dateToInt(n)
			,e>n&&(a=e,e=n,n=a)
			,s=this.cal.args.checkRange
			if(!s)
				return this._do_selectRange(e,n)
			try{
				setFanc(
					new Cal.Selection([[e,n]],Cal.SEL_MULTIPLE,func).getDates()
					,fapply(
						this.cal,
						function(t){
							if(this.isDisabled(t))throw s instanceof Function&&s(t,this),"OUT"
						}
					)
				)
				,this._do_selectRange(e,n)
			}catch(i){}
		}
	
		,_do_selectRange:function(t,e){
			this.sel.push([t,e])
			,this.normalize()
			,this.onChange(this)
		}
	
		,isSelected:function(t){
			var e
			,slen=this.sel.length
			for(;--slen>=0;){
				e=this.sel[slen]
				if(e instanceof Array&&t>=e[0]&&t<=e[1]||t==e)
					return true
			}
			return false
		}
		
		,getFirstDate:function(){
			var t=this.sel[0]
			if(t&&t instanceof Array)
				t=t[0]
			return t
		}
		
		,getLastDate:function(){
			if(this.sel.length>0){
				var t=this.sel[this.sel.length-1]
				if(t&&t instanceof Array)
					t=t[1]
				return t
			}
		}
		
		,print:function(t,e){
			var n,str=[]
			,i=0
			,hour=this.cal.getHours()
			,minute=this.cal.getMinutes()
			for(e||(e=" -> ");i<this.sel.length;){
				n=this.sel[i++]
				if(n instanceof Array)
					str.push(printDate(intToDate(n[0],hour,minute),t)+e+printDate(intToDate(n[1],hour,minute),t))
				else
					str.push(printDate(intToDate(n,hour,minute),t))
			}
			return str
		}
	
		,getDates:function(t){
			var e,n,str=[]
			for(i=0;i<this.sel.length;){
				n=this.sel[i++]
				if(n instanceof Array){
					e=intToDate(n[0])
					for(n=n[1];dateToInt(e)<n;){
						str.push(t?printDate(e,t):new Date(e))
						,e.setDate(e.getDate()+1)
					}
				}else 
					e=intToDate(n)
				str.push(t?printDate(e,t):e)
			}
			return str
		}
	}
		,Cal.isUnicodeLetter=function(str){
			return str.toUpperCase()!=str.toLowerCase()
		}
	
		,Cal.parseDate=function(e,n,a){
		var s,i,r,o,l,c,h,u,d,f,y
		if(!/\S/.test(e))
			return""
		e=e.replace(/^\s+/,"").replace(/\s+$/,"")
		,a=a||new Date
		,s=null
		,i=null
		,r=null
		,o=null
		,l=null
		,c=null
		,h=e.match(/([0-9]{1,2}):([0-9]{1,2})(:[0-9]{1,2})?\s*(am|pm)?/i)
		,h&&(
			o=parseInt(h[1],10)
			,l=parseInt(h[2],10)
			,c=h[3]?parseInt(h[3].substr(1),10):0
			,e=e.substring(0,h.index)+e.substr(h.index+h[0].length)
			,h[4]&&(
				h[4].toLowerCase()=="pm"&&12>o?o+=12:h[4].toLowerCase()!="am"||12>o||(o-=12)
			)
		)
		,u=function(){
			function n(){
				return e.charAt(l++)
			}
			function a(){
				return e.charAt(l)
			}
			function s(t){
				for(;a()&&h(a());)
					t+=n()
				return t
			}
			function i(){
				for(var t="";a()&&/[0-9]/.test(a());)
					t+=n()
				return h(a())?s(t):parseInt(t,10)
			}
			function r(t){
				c.push(t)
			}
			for(var o,l=0,c=[],h=Cal.isUnicodeLetter;l<e.length;)
				o=a()
				,h(o)?r(s("")):/[0-9]/.test(o)?r(i()):n()
			return c
		}()
		,d=[]
		for(f=0;f<u.length;++f){
			y=u[f]
			,/^[0-9]{4}$/.test(y)?(
				s=parseInt(y,10)
				,null==i&&null==r&&null==n&&(n=true)
			)
			:
			/^[0-9]{1,2}$/.test(y)?(
				y=parseInt(y,10)
				,60>y?0>y||y>12?1>y||y>31||(r=y):d.push(y):s=y
			)
			:
			null==i&&(i=kcmonth(y))
		}
		d.length<2?
			d.length==1&&(null==r?r=d.shift():null==i&&(i=d.shift()))
			:
		n?(
			null==i&&(i=d.shift())
			,null==r&&(r=d.shift())
		)
		:
		(
			null==r&&(r=d.shift()),null==i&&(i=d.shift())
		)
		,null==s&&(s=d.length>0?d.shift():a.getFullYear())
		,30>s?s+=2e3:99>s&&(s+=1900)
		,null==i&&(i=a.getMonth()+1)
		return null!=s&&null!=i&&null!=r?new Date(s,i-1,r,o,l,c):null
	}
	
	,mth={
		elastic_b:function(t){
			return 1-Math.cos(5.5*-t*Math.PI)/Math.pow(2,7*t)
		}
		,magnetic:function(t){
			return 1-Math.cos(10.5*t*t*t*Math.PI)/Math.exp(4*t)
		}
		,accel_b:function(t){
			return t=1-t,1-t*t*t*t
		}
		,accel_a:function(t){
			return t*t*t
		}
		,accel_ab:function(t){
			return t=1-t,1-Math.sin(t*t*Math.PI/2)
		}
		,accel_ab2:function(t){
			return(t/=.5)<1?.5*t*t:-0.5*(--t*(t-2)-1)
		}
		,brakes:function(t){
			return t=1-t,1-Math.sin(t*t*Math.PI)
		}
		,shake:function(t){
			return.5>t?-Math.cos(11*t*Math.PI)*t*t:(t=1-t,Math.cos(11*t*Math.PI)*t*t)
		}
	}
	
	return Cal
	
}()







console.timeEnd('Timer1');


