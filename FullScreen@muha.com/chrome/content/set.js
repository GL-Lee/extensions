var prefService = Components.classes["@mozilla.org/preferences-service;1"]
.getService(Components.interfaces.nsIPrefService);
var branch = prefService.getBranch("extensions.fullscreen.");
var tabNav={
  on_fullscreen:branch.getBoolPref("on_fullscreen"),
  mouse_button:branch.getIntPref("mouse_button"),
  init: function(){
    document.getElementById("on_fullscreen").checked = this.on_fullscreen;
    document.getElementById("mouse_button_group").selectedIndex = this.mouse_button;
  },
  set: function(){
    branch.setBoolPref("on_fullscreen", document.getElementById("on_fullscreen").checked);
    branch.setIntPref("mouse_button", document.getElementById("mouse_button_group").selectedIndex);
  }
}
function setPref(){
  tabNav.set();
}
window.addEventListener("load", function(){
  tabNav.init();
})
