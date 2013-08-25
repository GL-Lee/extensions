var am={
	timer: null,
	mposition:{left:"0px",top:"0px"},
	$doc:null,
	$tip:null,
	imgTarget:null,
	intip:0,
	init: function(){
		am.$doc = $($("#content")[0].contentDocument);//获得网页对应的document
		if($("#am_tip",am.$doc).length == 0){
			var amHtml="<div id='am_tip' style='position:fixed;left:0px;top:0px;border:solid thin;'>tip</div>";
			am.$tip=$(amHtml).appendTo($("body",am.$doc));
		}
		am.bindEvents();
	},
	bindEvents: function(){
		am.bindMouseEvent();
		am.bindKeyEvent();
		am.bindImgEvent();
		am.bindAmEvent();
	},
	bindImgEvent: function(){
		var $imgs = $("img",am.$doc);
		$imgs.hover(function(){
			clearTimeout(am.timer);
			var _this = this;
			var _mposition;
			am.imgTarget=this;
			am.timer = setTimeout(function(){
				// am.show();
				var position = am.getPosition(15,-15);
				am.$tip.css({left:position.left,top:position.top}).text(_this.src);
				am.$tip.css("display","block");
				// am.$tip.show();
			},300)
		},function(){
			clearTimeout(am.timer);
			setTimeout(function(){
				if (!am.intip) {
					am.$tip.css("display","none");
				};
			},100);
		});
		am.$tip.hover(function(){am.intip = 1;},function(){am.intip = 0;})
	},
	bindMouseEvent: function(){
		am.$doc.bind("mousemove",function(event){
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
	    var fun = document.getElementById(contextMenuitemId).getAttribute("oncommand");
	    if(!fun){
	    	var commandId = document.getElementById(id).getAttribute("command");
	    	fun = document.getElementById(commandId).getAttribute("oncommand");
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
window.addEventListener("DOMContentLoaded",am.init,false);
window.addEventListener("TabSelect",function(){
		am.$doc = $($("#content")[0].contentDocument);
		am.$tip = $("#am_tip",am.$doc);
	},false);