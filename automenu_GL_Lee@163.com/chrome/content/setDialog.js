var setDialog = {
	init: function(){
		setDialog.bindEvents();
	},
	bindEvents: function(){
		document.getElementById("am_elements").addEventListener("click",function(event){
			var l = event.target;
			var am_menuitems = document.getElementById("am_menuitems").children;
			for(var i = 0,len = am_menuitems.length; i < len; i++){
				am_menuitems[i].checked = false;
			}
		 	var currentset = l.parentNode.getAttribute("currentset").split(" ");
		 	for(var i = 0, len = currentset.length; i < len; i++){
		 		document.getElementById(currentset[i]).checked = true;
		 	}
		})
	}
}
window.onload = setDialog.init;