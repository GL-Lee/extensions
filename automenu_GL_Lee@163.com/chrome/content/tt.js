var am={
	timer: null,
	mposition:{left:0,top:0,offleft:0,offtop:0},
	$doc:null,
	$tip:null,
	imgTarget:null,
	intip:0,
	iteminfos:{
		am_CopyImage:{tooltiptext:"Copy Image",menuitemId:"context-copyimage"},
		am_CopyLink:{tooltiptext:"Copy Link",menuitemId:"context-copylink"},
		am_ImageInfo:{tooltiptext:"Image Info",menuitemId:"context-viewimageinfo"},
		am_SaveImageAs:{tooltiptext:"Save Image As",menuitemId:"context-saveimage"},
		am_SendImage:{tooltiptext:"Send Image",menuitemId:"context-sendimage"}
	},
	init: function(){
		am.$tip = $("#am_wrapper");
		am.buildPanel();
		am.bindEvents();
	},
	buildPanel: function(){
		for(var itemid in am.iteminfos){
			var item = $("<a tooltiptext='"+am.iteminfos[itemid].tooltiptext+"'><image id='"+itemid+"'/></a>");
			am.$tip.append(item);
		}
	},
	bindEvents: function(){
		am.bindMouseEvent();
		am.bindKeyEvent();
		am.bindImgEvent();
		am.bindAmEvent();
	},
	bindImgEvent: function(){
		$(window).bind("mouseover",am.imgMouseover);
		$(window).bind("mouseout",am.imgMouseout);
		am.$tip.hover(function(){am.intip = 1;},function(){am.intip = 0;})
	},
	imgMouseover:function(){
		var target = arguments[0].target;
		var view = arguments[0].view;
		if(target.tagName.toLowerCase() == "img"){
			if(am.timer)clearTimeout(am.timer);
			am.timer = setTimeout(function(){
				am.imgTarget=target;
				var position = am.getPosition(15,-15);
				am.$tip.css({left:position.left,top:position.top});
				am.$tip.show();
			},300)
		}
	},
	imgMouseout: function(){
		var event = arguments[0];
		if(event.target.tagName.toLowerCase() == "img"){
			setTimeout(function(){
				if (!am.intip) am.$tip.hide();
			},100);
		}
	},
	bindMouseEvent: function(){
		document.addEventListener("mousemove",function(event){
			am.mposition.left = event.screenX;
			am.mposition.top = event.screenY;
		},true);
	},
	bindKeyEvent: function(){

	},
	bindAmEvent: function(){
		$("#am_wrapper").bind("click",function(event){
			am.doCommand(am.iteminfos[event.target.id].menuitemId,am.imgTarget);
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
}
$(window).bind("load",am.init);
