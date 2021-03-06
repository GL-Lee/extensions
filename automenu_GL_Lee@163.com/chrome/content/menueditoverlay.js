var am={
	timer: null,
	mposition:{left:0,top:0,offleft:0,offtop:0},
	$doc:null,
	$tip:null,
	imgTarget:null,
	intip:0,
	activedEles:"",
	prefs:null,
	inited:false,
	iteminfos:{
		// am_BackFalse:{tooltiptext:"Back False",menuitemId:"context-copyimage"},
		// am_BackInactive:{tooltiptext:"Back In active",menuitemId:"context-copylink"},
		// am_BackTrue:{tooltiptext:"Back True",menuitemId:"context-viewimageinfo"},
		am_Bookmark:{tooltiptext:"Bookmark Page",menuitemId:"context-bookmarkpage"},
		am_CopyImage:{tooltiptext:"Copy Image",menuitemId:"context-copyimage"},
		am_CopyLink:{tooltiptext:"Copy Link",menuitemId:"context-copylink"},
		am_CornerLeft:{tooltiptext:"Corner Left",menuitemId:"context-copylink"},
		am_CornerRight:{tooltiptext:"Corner Right",menuitemId:"context-viewimageinfo"},
		am_ForwardFalse:{tooltiptext:"Forward False",menuitemId:"context-saveimage"},
		am_ForwardInactive:{tooltiptext:"Forward In active",menuitemId:"context-sendimage"},


 		// am_ForwardTrue:{tooltiptext:"Forward True",menuitemId:"context-copyimage"},
		am_ImageInfo:{tooltiptext:"Image Info",menuitemId:"context-viewimageinfo"},
		am_Inspect:{tooltiptext:"Inspect",menuitemId:"context-inspect"},
		am_OpenInNewprivate:{tooltiptext:"Open In New private",menuitemId:"context-openlinkprivate"},
		am_OpenInNewtab:{tooltiptext:"Open In New tab",menuitemId:"context-openlinkintab"},
		am_OpenInNewwindow:{tooltiptext:"Open In New window",menuitemId:"context-openlink"},
		am_PageInfo:{tooltiptext:"Page Info",menuitemId:"context-viewinfo"},
		am_Paste:{tooltiptext:"Paste",menuitemId:"context-paste"},
		am_Reload:{tooltiptext:"Reload",menuitemId:"context-reload"},
		am_SaveAs:{tooltiptext:"Save As",menuitemId:"context-savepage"},


		am_SaveImageAs:{tooltiptext:"Save Image As",menuitemId:"context-saveimage"},
		am_SaveLinkAs:{tooltiptext:"Save Link As",menuitemId:"context-savelink"},
		am_SavePageAs:{tooltiptext:"Save Page As",menuitemId:"context-savepage"},
		am_SelectAll:{tooltiptext:"Select All",menuitemId:"context-selectall"},
		am_SendImage:{tooltiptext:"Send Image",menuitemId:"context-sendimage"},
		am_SendLink:{tooltiptext:"Send Link",menuitemId:"context-copyimage"},
		am_ShowBackgroundImage:{tooltiptext:"Show Background Image",menuitemId:"context-copylink"},
		am_ShowSource:{tooltiptext:"Show Source",menuitemId:"context-viewimageinfo"},
		am_Stop:{tooltiptext:"Stop",menuitemId:"context-stop"},
	},
	init: function(){
		am.console = (Cu.import("resource://gre/modules/devtools/Console.jsm", {})).console;
		am.console.log("Hello from Firefox code");

		// if(!am.prefs){
		// 	try{
		// 		am.prefs = Components.classes["@mozilla.org/preferences-service;1"]
		// 		                    .getService(Components.interfaces.nsIPrefService).getBranch("extensions.automenu_GL.");
		// 		am.switchonoff = am.prefs.getBoolPref("menu.on");
		// 	}catch(e){am.switchonoff=true}
		// }
		am.switchonoff = ($("#am-switch-on").attr("switchonoff")=="on")?true:false;
		if(!am.switchonoff) return;
		if(am.inited) return;
		$("#am_wrapper").addClass($("#am_wrapper").attr("size"));
		am.switchKey={fnKey:"ctrlKey",key:49},
		am.$tip = $("#am_wrapper");
		am.buildPanel();
		am.bindEvents();
		am.setDialog.init();
		am.inited = true;
	},
	buildPanel: function(){
		var activedEles = am.activedEles = $("#am_wrapper").attr("activedEles")
		if(!activedEles || activedEles.match(/\s*/)){
			activedEles = $("#am_wrapper").attr("default");
		}
		activedEles = activedEles.split(" ");
		for(var i = 0; i < activedEles.length; i++){
			if(activedEles[i] == "")break;
			am.addMenuitem($("#"+activedEles[i]));
		}
		am.activedEles = activedEles;
	},
	addMenuitem: function(activedEle){
				am.console.log(activedEle[0].id);
		var activedMenuitems = activedEle.attr("activedMenuitems") || activedEle.attr("default");
		activedMenuitems = activedMenuitems.split(" ");
		var x = activedMenuitems.length;
		var y = Math.sqrt(x);
				am.console.log(x+":"+y);
		for(var i = 0;i < x;){
			var row = $("<box class='am-row'/>")
				am.console.log(row.children().length);
			for(var j=0; j<y && j<x && i<x;i++){
				am.console.log(i);
				am.console.log(activedMenuitems[i]);
				if(activedMenuitems[i] == "" || !am.iteminfos["am_"+activedMenuitems[i]]){
					continue;
					// j--;
				}
				var iteminfo = am.iteminfos["am_"+activedMenuitems[i]];
				if(iteminfo){
					var htmltext = "<a id='am_" + activedMenuitems[i] +"' class='am-item' tooltiptext='"+iteminfo.tooltiptext+"'>"+
									"<box class='image'>"+
										"<image class='am_"+activedMenuitems[i]+"'/>"+
									"</box>"+
									"<box class='am-item-text'>"+iteminfo.tooltiptext+"</box>"+
								"</a>";
					row.append($(htmltext));
					j++
				}
			}
			activedEle.append(row);
		}
	},
	bindEvents: function(){
		am.bindMouseEvent();
		// am.bindKeyEvent();
		am.bindImgEvent();
		am.bindAmEvent();
	},
	bindImgEvent: function(){
		$(document).bind("mouseover.am",am.imgMouseover);
		$(document).bind("mouseout.am",am.imgMouseout);
		am.$tip.hover(function(){am.intip = 1;},function(){am.intip = 0;})
	},
	unbindEvent: function(){
		$(document).unbind("mouseover.am",am.imgMouseover);
		$(document).unbind("mouseout.am",am.imgMouseout);
	},
	imgMouseover:function(){
		if(!am.switchonoff)return;
		var target = arguments[0].target;
		var view = arguments[0].view;
		if(target.tagName.toLowerCase() == "img"){
			if(am.activedEles.indexOf("am_image") == -1) return;
			if(am.timer)clearTimeout(am.timer);
			am.inImg = true;
			am.timer = setTimeout(function(){
				am.imgTarget=target;
				var position = am.getPosition(15,-15);
				am.$tip.css({left:position.left,top:position.top});
				if(am.inImg){
					am.$tip.show();
				}
				console.log("Hello from Firefox code");
			},200)
			$("#am_image").addClass("actived");
		}
	},
	imgMouseout: function(){
		if(!am.switchonoff)return;
		var event = arguments[0];
		if(event.target.tagName.toLowerCase() == "img"){
			am.inImg = false;
			setTimeout(function(){
				if (!am.intip) {
					am.$tip.hide();
				}
			},20);
		}
		am.clicked = 0;
	},
	bindMouseEvent: function(){
		document.addEventListener("mousemove",function(event){
			am.mposition.left = event.screenX;
			am.mposition.top = event.screenY;
		})
	},
	// bindKeyEvent: function(){
	// 	window.addEventListener("keypress", function(event){
	// 		var fnkeydown = event[am.switchKey.fnKey];
	// 		var key = event.keyCode || event.which;
	// 		if(fnkeydown && key == am.switchKey.key){
	// 			am.switchonoff = !am.switchonoff
	// 		}
	// 		if(am.switchonoff) am.init()
	// 		// else am.unbindEvent()
	// 	});
	//},
	bindAmEvent: function(){
		$("#am_wrapper").bind("click",function(event){
			am.doCommand(am.iteminfos[$(event.target).closest("a")[0].id].menuitemId,am.imgTarget);
			$(this).hide();
			am.clicked = 1;
		})
		am.$tip.hover(null,function(){$(this).hide()})
	},
	switchonoff: function(){
		am.switchonoff = !am.switchonoff;
	},
	getPosition: function(offx,offy,$hoverImg){
		var left = am.mposition.left - window.mozInnerScreenX+offx;
		var top = am.mposition.top - window.mozInnerScreenY+offy;
		var position = {left:left,top:top};
		if($hoverImg && position.left>$hoverImg.css){

		}
		return position;
	},
	getAbsolutePositon: function(){
		var position = {};
		return position;
	},
	doCommand: function(contextMenuitemId,target) {
		id="#"+contextMenuitemId;
	    var fun = $(id).attr("oncommand");
	    if(!fun){
	    	var commandId = $(id).attr("command");
	    	fun = $(commandId).attr("oncommand");
	    }
	    document.popupNode = target;/*
	    							 * 解决error
									 * TypeError: aNode is null
									 * chrome://browser/content/nsContextMenu.js
									 */
		gContextMenu = new nsContextMenu(target, gBrowser);
		eval(fun);
	},
	amSwitch: function(){
		if($("#am-switch-on").attr("switchonoff") == "on"){
			am.switchonoff = false;
			$("#am-switch-on").attr("switchonoff","off")
		}else{
			am.switchonoff = true;
			$("#am-switch-on").attr("switchonoff","on")
			am.init();
		}
		
	},
	openSetDialog: function() {
	  	$("#am_setDialog_wrapper").css("display","-moz-box");
	},
	setDialog : {
		inited:false,
		aleCurrentset:"",
		panel:null,
		drag:{},
		setedEles:{},
		init: function(){
			if(this.inited) return;
			this.panel = $("#am_setDialog_wrapper");
			var count = 0;
			$("#am_elements checkbox").each(function(i,it){
				if(am.activedEles.indexOf($(this).parent().attr("activedEleId")) != -1){
					if(count == 0){
						/*将第一个activedEle对应的checkbox设为选中状态*/
						$(this.parentNode).addClass("actived");
						/*设置第一个activedEle的menuitem*/
						activedEleId = $(this).parent().attr("activedEleId");
						activedEle = $(document.getElementById(activedEleId));
						var activedMenuitems = activedEle.attr("activedMenuitems") || activedEle.attr("default");
						$("#am_menuitems checkbox").each(function(i,it){
							if($(this).attr("itemId") && activedMenuitems.indexOf($(this).attr("itemId")) != -1){
								this.checked = true
							}
						})
						count++;
					}
					this.checked = true
				}
			})
			var size = $("#am_wrapper").attr("size");
			$("#am_item_size radio[value="+size+"]")[0].click();
			if($("#am_wrapper").hasClass("am-wrapper-single")){
				$("#am_text_on").attr("checked", "true");
			}else{
				$("#am_text_on").attr("checked", "false");
			}
			/* 生成hotkey list */
			this.generateHotkeyList();
			this.bindEvents();
			this.inited = true
		},
		bindEvents: function(){
			var settingEle = $("#am_elements .actived");
			var activedEleId=settingEle.attr("activedEleId");
			$("#am_elements").bind("click",function(event){
				var l = event.target;
				while(l.parentNode.id != "am_elements"){
					l = l.parentNode;
				}
				if(l.id == "am_elements"){
					return;
				}
				settingEle = $(l);
				activedEleId=settingEle.attr("activedEleId");
				var am_menuitems = $("#am_menuitems").children();
				for(var i = 0,len = am_menuitems.length; i < len; i++){
					am_menuitems[i].checked =  false;
				}
				var activedEle = $("#"+activedEleId);
			 	var activedMenuitems = activedEle.attr("activedMenuitems") || activedEle.attr("default");
			 	$("#am_menuitems checkbox").each(function(i,it){
			 		$this = $(this);
			 		if(activedMenuitems.indexOf($this.attr("itemId")) != -1){
			 			this.checked = true;
			 		}
			 	})
			 	$(".actived").removeClass("actived");
			 	settingEle.addClass("actived");
			 	$("#am_menuitems .am_h1 span").text(settingEle.text());
			 	$("#am_menuitems")[0].scrollTop = 0;
			})
			$("#am_menuitems").bind("click",function(event){
				var settingMenu = $("#"+activedEleId);
				var itemId = $(event.target).attr("itemId");
				if(!event.target.checked){
					am.setDialog.removeItem(settingMenu,itemId)
				}else{
					am.setDialog.addItem(settingMenu,itemId)
				}
			})
			/* 给拖动窗口大小的控件添加事件监听 */
			$("#am_resize_content").bind("mousedown",function(event){
				am.setDialog.resize.start = 1;
				am.setDialog.bindResize(event.screenY);
			}).bind("mouseup",function(){
				am.setDialog.resize.start = 0;
				$(document).unbind("mousemove.am");
			});
			$("#am_setDialog_sure").bind("click",function(){
				am.setDialog.set();
				am.setDialog.panel.css("display","none");
			})
			am.setDialog.panel.find(".header").bind("mousedown",function(event){
				am.setDialog.drag.start = 1;
				am.setDialog.drag.offset = {
					left:event.clientX - parseInt(am.setDialog.panel.css("left")),
					top:event.clientY - parseInt(am.setDialog.panel.css("top")),
				};
				am.setDialog.bindMove(event.screenX,event.screenY);
			}).bind("mouseup",function(){
				am.setDialog.drag.start = 0;
				$(document).unbind("mousemove.am");
			})
			$("#am_elements,#am_menuitems,#am_set_switch_key").bind("click",function(){
				am.setDialog.setedEles[this.id]=1;
			})
		},
		bindMove: function(screenX,screenY){
			var x = screenX;
			var y = screenY;
			var left = parseInt(am.setDialog.panel.css("left"));
			var top = parseInt(am.setDialog.panel.css("top"));
			$(document).bind("mousemove.am",function(event){
				if(am.setDialog.drag.start == 1){
					left = left + event.screenX - x;
					top = top + event.screenY - y;
					am.setDialog.panel.css({left:left+"px",top:top+"px"});
					x = event.screenX;
					y = event.screenY;
				}
			});
		},
		bindResize: function(screenY){
			var content = $("#am_setDialog_content");
			var mi = $("#am_menuitems");
			var rightIframe = content.find("iframe");
			var height = "400px";
			var y = screenY;
			$(document).bind("mousemove.am",function(event){
				if(am.setDialog.resize.start == 1){
					height = parseInt(content.css("height")) - (event.screenY - y);
					content.css("height",height+"px");
					// lr.css("height",height);
					// rightIframe.css("height",height+"px");
					mi.css("height",height-150+"px");
					y = event.screenY;
				}
			});
		},
		addItem: function(settingMenu, itemId){
			var items = settingMenu.attr("activedMenuitems");
			if(!items || !(/\S/.test(items))){
				items = settingMenu.attr("activedMenuitems") || settingMenu.attr("default");
			}
			items += " " + itemId;
			settingMenu.attr("activedMenuitems" ,items);
		},
		removeItem: function(settingMenu, itemId){
			var items = settingMenu.attr("activedMenuitems") || settingMenu.attr("default");
			var reg = new RegExp("\\b"+itemId+" *","g");
			items = items.replace(reg,"");
			settingMenu.attr("activedMenuitems" ,items);
		},
		/* 生成hotkey list */
		generateHotkeyList: function(){
			var menupopup = $("<menupopup/>");
			var charcode = 48;
			var menuitem = {};
			while(charcode<58){
				menuitem = $("<menuitem label='"+String.fromCharCode(charcode)+"'></menuitem>")
				menupopup.append(menuitem);
				charcode++;
			}
			charcode = 65;
			while(charcode<91){
				menuitem = $("<menuitem label='"+String.fromCharCode(charcode)+"'></menuitem>")
				menupopup.append(menuitem);
				charcode++;
			}
			$("#am_hotkey_list").append(menupopup);
		},
		cancel: function(){
			am.setDialog.panel.css("display","none");
		},
		resizeStart: function(){
			var content = $("#am_setDialog_content");
			var mi = $("#am_menuitems");
			var rightIframe = content.find("iframe");
			var height = "400px";
			$("#am_resize_content").bind("mousedown",function(){
				height = parseInt(content.css("height")) + am.mposition.topChange;
				content.css("height",height+"px");
				// lr.css("height",height);
				rightIframe.css("height",height+"px");
				mi.css("height",height-150+"px");
			})
		},
		resizeEnd: function(){
			$("#am_resize_content").unbind("mousemove.resize");
		},
		resize: function(){
			// am_setDialog = $("#am_setDialog")
			// var height = am_setDialog.css("height");
			// $(".resizable").css("height",height);
		},
		dock: function(){
			var setDialogWrapper = $("#am_setDialog_wrapper");
			if(setDialogWrapper.hasClass("am_docked")){
				setDialogWrapper.removeClass("am_docked")
			}else{
				setDialogWrapper.addClass("am_docked");
			}
			var position = am.setDialog.popPosition || am.setDialog.getPopPosition();
			setDialogWrapper.css(position);
		},
		getPopPosition: function(){
			var left = am.setDialog.panel.attr("panel_left");
			if(!left){
				left = ($(window).width()-am.setDialog.panel.width())/2
			}
			var top = am.setDialog.panel.attr("panel_top");
			if(!top){
				top = ($(window).height()-am.setDialog.panel.height())/2
			}
			return {left:left+"px",top:top+"px"};
		},
		set: function(){
			this.setElementes();
			this.setMenuitems();
			this.setShortcut();
			this.setItemsize();
			this.setTexton();
		},
		setElementes: function(){
			var activedEles = "";
			$("#am_elements checkbox[checked=true]").each(function(i,it){
				activedEles+=($(this).parent().attr("activedEleId")+" ");
			});
			am.activedEles = activedEles;
			$("#am_wrapper").attr("activedEles", activedEles);
		},
		setMenuitems: function(){
			$("#am_wrapper vbox").each(function(i,it){
				var $this = $(this);;
				var activedMenuitems="";
				activedMenuitems  = $this.attr("activedMenuitems")
				$this.attr("activedMenuitems",activedMenuitems);
				$this.children().remove();
				am.addMenuitem($this);
			})
		},
		setShortcut: function(){
			this.setSwitchKey();
		},
		setSwitchKey: function(){
			if(am.setDialog.setedEles.am_set_switch_key == 1){
				var modifiers = "";
				$("#am_set_switch_key checkbox[checked=true]").each(function(i,it){
					modifiers += $(this).attr("value")+" "
				})
				$("#am_set_switch_key").attr("modifiers",modifiers);
				$("#am_set_switch_key menulist")[0].value;
			}
		},
		setItemsize: function(){
			var itemsize = $("#am_item_size radio[selected=true]").attr("value");
			$("#am_wrapper").removeClass("small large").addClass(itemsize).attr("size",itemsize);
		},
		setTexton: function(){
			var on = $("#am_text_on")[0].checked;
			if(on){
				$("#am_wrapper").addClass("am-wrapper-single").removeClass("am-wrapper-multiply")
			}else{
				$("#am_wrapper").addClass("am-wrapper-multiply").removeClass("am-wrapper-single")
			}
		},
		close: function(){
			am.setDialog.panel.hide();
		}
	}
}
$(window).bind("load",am.init);
function am_setListKey(){
	var list = $("#am_hotkey_list")[0];
	list.value = list.selectedItem.label;
}

/*
1.reset button
2.menu展示优化
3.setDialog可以拖出来 --over
4.setDialog内menuitem拖动
5.menu内menuitem的拖动
6.key冲突
*/