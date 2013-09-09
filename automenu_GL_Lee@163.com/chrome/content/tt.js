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
		am.switchKey={fnKey:"ctrlKey",key:49},
		am.$tip = $("#am_wrapper");
		am.buildPanel();
		am.bindEvents();
		am.setDialog.init();
		am.inited = true;
	},
	buildPanel: function(){
		var activedEles = am.activedEles = $("#am_wrapper").attr("activedEles")||$("#am_wrapper").attr("default");
		activedEles = activedEles.split(" ");
		for(var i = 0; i < activedEles.length; i++){
			if(activedEles[i] == "")break;
			am.addMenuitem($("#"+activedEles[i]));
		}
	},
	addMenuitem: function(activedEle){
		var activedMenuitems = activedEle.attr("activedMenuitems") || activedEle.attr("default");
		activedMenuitems = activedMenuitems.split(" ");
		var htmltext = "";
		for(var i = 0;i < activedMenuitems.length; i++){
			if(activedMenuitems[i] == "")break;
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
		am.bindKeyEvent();
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
	bindKeyEvent: function(){
		window.addEventListener("keypress", function(event){
			var fnkeydown = event[am.switchKey.fnKey];
			var key = event.keyCode || event.which;
			if(fnkeydown && key == am.switchKey.key){
				am.on = !am.on
			}
			if(am.on) am.init()
			else am.unbindEvent()
		});
	},
	bindAmEvent: function(){
		$("#am_wrapper").bind("click",function(event){
			am.doCommand(am.iteminfos[event.target.id].menuitemId,am.imgTarget);
			$(this).hide();
			am.clicked = 1;
		})
		am.$tip.hover(null,function(){$(this).hide()})
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
	  	$("#am_setDialog_wrapper").show();
	},
	setDialog : {
		inited:false,
		aleCurrentset:"",
		init: function(){
			if(this.inited) return;
			var count = 0;
			$("#am_elements checkbox").each(function(i,it){
				if(am.activedEles.indexOf($(this).attr("activedEleId")) != -1){
					if(count == 0){
						/*将第一个activedEle对应的checkbox设为选中状态*/
						$(this.parentNode).addClass("actived");
						/*设置第一个activedEle的menuitem*/
						activedEleId = $(this).attr("activedEleId");
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
			this.bindEvents();
			this.inited = true
		},
		bindEvents: function(){
			document.getElementById("am_elements").addEventListener("click",function(event){
				var l = event.target;
				var am_menuitems = document.getElementById("am_menuitems").children;
				for(var i = 0,len = am_menuitems.length; i < len; i++){
					am_menuitems[i].checked = false;
				}
			 	var currentset = l.parentNode.getAttribute("currentset")
			 	if(currentset) currentset = currentset.split(" ");
			 	for(var i = 0, len = currentset.length; i < len; i++){
			 		document.getElementById(currentset[i]).checked = true;
			 	}
			 	var actived = document.getElementsByClassName("actived")[0]
			 	var className = actived.className.replace(/ *actived/,"");
			 	actived.className = className;
			 	l.parentNode.className+=" actived";
			})
			$("#am_setDialog resizer").bind("mousedown.resize",am.setDialog.resizeStart).bind("mouseup.resize",am.setDialog.resizeEnd);
			$("#am_setDialog_sure").bind("click",function(){
				var activedEles = "";
				$("#am_elements checkbox[checked=true]").each(function(i,it){
					activedEles+=($(this).attr("activedEleId")+" ");
				});
				am.activedEles = activedEles;
				$("#am_wrapper").attr("activedEles", activedEles);
			})
			$("#am_menuitems checkbox").bind("click",function(){
				var activedEleId = $("#am_elements actived").attr("activedEleId");
				var activedEle = $(document.getElementById(activedEleId));
				var activedMenuitems = activedEle.attr("activedMenuitems");
				var reg = new RegExp("\\b"+$(this).attr("itemId")+" |$");
				if(this.checked){
					
					activedMenuitems.replace(reg,"");
					$(document.getElementById(activedEleId)).attr("activedMenuitems",activedMenuitems);
				}else{

				}
			})
		},
		cancel: function(){
			$("#am_setDialog_wrapper").hide();
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
		}
	}
}
$(window).bind("load",am.init);
/*
1.reset button
2.menu展示优化
3.setDialog可以拖出来
4.setDialog内menuitem拖动
5.menu内menuitem的拖动
*/