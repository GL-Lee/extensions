var am={
		timer: null,
		init: function(){
		var amHtml="<box id='am_tip'>tip</box>";
		$(amHtml).appendTo($("#main-window"));
		am.bindEvents();
	},
	bindEvents: function(){
		am.bindImgEvent();
		am.bindKeyEvent();
	},
	bindImgEvent: function(){
		var doc = $("#content")[0].contentDocument;//获得网页对应的document
		var $imgs = $("img",$(doc));
		$imgs.hover(function(){
			clearTimeout(am.timer);
			var _this = this;
			am.timer = setTimeout(function(){
				$("#am_tip").text(_this.src)
			},100)},function(){})
	},
	bindKeyEvent: function(){

	}
}
window.addEventListener("DOMContentLoaded",am.init,false);