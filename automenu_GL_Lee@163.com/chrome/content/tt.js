var am={
	timer: null,
	mposition:{left:"0px",top:"0px"},
	$doc:null,
	$tip:null,
	imgTarget:null,
	intip:0,
	init: function(){
		am.$tip = $("#am_tip");
		am.bindEvents();
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
		if(target.tagName.toLowerCase() == "img"){
			if(am.timer)clearTimeout(am.timer);
			am.timer = setTimeout(function(){
				am.imgTarget=target;
				var position = am.getPosition(15,-15);
				am.$tip.css({left:position.left,top:position.top}).text(target.src);
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
		$(window).bind("mousemove",function(event){
			am.mposition.left = event.clientX;
			am.mposition.top = event.clientY;
		})
	},
	bindKeyEvent: function(){

	},
	bindAmEvent: function(){
		am.$tip.bind("click",function(){
			am.$tip.hide();
			am.doCommand("context-saveimage",am.imgTarget);
		});
	},
	getPosition: function(offx,offy,$hoverImg){
		var position = {left:am.mposition.left+offx,top:am.mposition.top+offy};
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
