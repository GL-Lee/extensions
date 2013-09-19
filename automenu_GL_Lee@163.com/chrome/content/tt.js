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
		am_CopyImage:{tooltiptext:"Copy Image",menuitemId:"context-copyimage"},
		am_CopyLink:{tooltiptext:"Copy Link",menuitemId:"context-copylink"},
		am_ImageInfo:{tooltiptext:"Image Info",menuitemId:"context-viewimageinfo"},
		am_SaveImageAs:{tooltiptext:"Save Image As",menuitemId:"context-saveimage"},
		am_SendImage:{tooltiptext:"Send Image",menuitemId:"context-sendimage"}
	},
	init: function(){
		if(!am.prefs){
			try{
				am.prefs = Components.classes["@mozilla.org/preferences-service;1"]
				                    .getService(Components.interfaces.nsIPrefService).getBranch("extensions.automenu_GL.");
				am.on = am.prefs.getBoolPref("menu.on");
			}catch(e){am.on=true}
		}
		if(!am.on) return;
		if(am.inited) return;
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
		var activedMenuitems = activedEle.attr("activedMenuitems") || activedEle.attr("default");
		activedMenuitems = activedMenuitems.split(" ");
		var htmltext = "";
		for(var i = 0;i < activedMenuitems.length; i++){
			if(activedMenuitems[i] == "")continue;
			var iteminfo = am.iteminfos["am_"+activedMenuitems[i]];
			if(iteminfo){
				htmltext += "<a tooltiptext='"+iteminfo.tooltiptext+"'>"+
								"<image id='am_" + activedMenuitems[i] + "' class='am_"+activedMenuitems[i]+"'/>"+
							"</a>";
			}
		}
		$(htmltext).appendTo(activedEle);
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
		if(!am.on)return;
		var target = arguments[0].target;
		var view = arguments[0].view;
		if(target.tagName.toLowerCase() == "img"){
			if(am.activedEles.indexOf("am_image") == -1) return;
			if(am.timer)clearTimeout(am.timer);
			am.timer = setTimeout(function(){
				am.imgTarget=target;
				var position = am.getPosition(15,-15);
				am.$tip.css({left:position.left,top:position.top});
				am.$tip.show();
			},300)
			$("#am_image").addClass("actived");
		}
	},
	imgMouseout: function(){
		if(!am.on)return;
		var event = arguments[0];
		if(event.target.tagName.toLowerCase() == "img"){
			setTimeout(function(){
				if (!am.intip) am.$tip.hide();
			},100);
		}
		am.clicked = 0;
	},
	bindMouseEvent: function(){
		document.addEventListener("mousemove",function(event){
			am.mposition.left = event.screenX;
			am.mposition.top = event.screenY;
		},true);
	},
	// bindKeyEvent: function(){
	// 	window.addEventListener("keypress", function(event){
	// 		var fnkeydown = event[am.switchKey.fnKey];
	// 		var key = event.keyCode || event.which;
	// 		if(fnkeydown && key == am.switchKey.key){
	// 			am.on = !am.on
	// 		}
	// 		if(am.on) am.init()
	// 		// else am.unbindEvent()
	// 	});
	//},
	bindAmEvent: function(){
		$("#am_wrapper").bind("click",function(event){
			am.doCommand(am.iteminfos[event.target.id].menuitemId,am.imgTarget);
			$(this).hide();
			am.clicked = 1;
		})
		am.$tip.hover(null,function(){$(this).hide()})
	},
	switchonff: function(){
		am.on = !am.on;
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
			/* 生成hotkey list */
			this.generateHotkeyList();
			this.bindEvents();
			this.inited = true
		},
		bindEvents: function(){
			var settingEle = $("#am_elements .actived");
			var activedEleId=settingEle.attr("activedEleId");
			$("#am_elements").bind("click",function(event){
				var l = $(event.target);
				settingEle = l.parent();
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
			})
			$("#am_menuitems").bind("click",function(event){
				var settingMenu = $("#"+activedEleId);
				var itemId = $(event.target).attr("itemId");
				if(this.checked){
					am.setDialog.removeItem(settingMenu,itemId)
				}else{
					am.setDialog.addItem(settingMenu,itemId)
				}
			})
			/* 给拖动窗口大小的控件添加事件监听 */
			$("#am_setDialog resizer").bind("mousedown.resize",am.setDialog.resizeStart).bind("mouseup.resize",am.setDialog.resizeEnd);
			$("#am_setDialog_sure").bind("click",function(){
				am.setDialog.set();
			})
			am.setDialog.panel.find(".header").bind("mousedown.drag",function(event){
				am.setDialog.drag.start = 1;
				am.setDialog.drag.offset = {
					left:event.clientX - parseInt(am.setDialog.panel.css("left")),
					top:event.clientY - parseInt(am.setDialog.panel.css("top")),
				};
				$(document).bind("mousemove.drag",function(event){
					if(am.setDialog.drag.start == 1){
						var left = event.clientX - am.setDialog.drag.offset.left;
						var top = event.clientY - am.setDialog.drag.offset.top;
						am.setDialog.panel.css({left:left,top:top});
					}
				})
			}).bind("mouseup.drag",function(){
				am.setDialog.drag.start = 0;
				$(document).unbind("mousemove.drag");
			})
			$("#am_elements,#am_menuitems,#am_set_switch_key").bind("click",function(){
				am.setDialog.setedEles[this.id]=1;
			})
		},
		addItem: function(settingMenu, itemId){
			var items = settingMenu.data("items");
			if(!items || !(/\S/.test(items))){
				items = settingMenu.attr("activedMenuitems") || settingMenu.attr("default");
			}
			items += " " + itemId;
			settingMenu.data("items" ,items);
		},
		removeItem: function(settingMenu, itemId){
			var items = settingMenu.data("items") || settingMenu.attr("activedMenuitems") || settingMenu.attr("default");
			var reg = new RegExp("\\b"+itemId+" |$");
			items.replace(reg,"");
			settingMenu.data("items" ,items);
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
			// $("#am_menuitems").css("height","auto");
			// $(document).bind("mousemove.resize",function(){
			// 	$(".resizable").css("height",$("#am_setDialog").css("height"));
			// })
		},
		resizeEnd: function(){
			// $(document).unbind("mousemove.resize");
		},
		resize: function(){
			// am_setDialog = $("#am_setDialog")
			// var height = am_setDialog.css("height");
			// $(".resizable").css("height",height);
		},
		pop: function(){
			var setDialogWrapper = $("#am_setDialog_wrapper");
			if(setDialogWrapper.hasClass("am_poped")){
				setDialogWrapper.removeClass("am_poped")
			}else{
				setDialogWrapper.addClass("am_poped");
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
			$("#am_wrapper box").each(function(i,it){
				var $this = null;
				var activedMenuitems="";
				$this = $(this);
				activedMenuitems  = $this.data("items")
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
				var checkboxs = 
				$("#am_set_switch_key checkbox[checked=true]").each(function(i,it){
					modifiers += $(this).attr("value")+" "
				})
				$("#am_set_switch_key").attr("modifiers",modifiers);
				$("#am_set_switch_key menulist")[0].value;
			}
		},
		setItemsize: function(){
			var itemsize = $("#am_item_size radio[selected=true]").attr("value");
			$("#am_wrapper").removeClass().addClass(itemsize);
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