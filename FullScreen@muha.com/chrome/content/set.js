var prefService = Components.classes["@mozilla.org/preferences-service;1"]
.getService(Components.interfaces.nsIPrefService);
var branch = prefService.getBranch("extensions.fullscreen.");
var tabNav={
  on_fullscreen:branch.getBoolPref("on_fullscreen"),
  mouse_button:branch.getIntPref("mouse_button"),
  menubar:branch.getBoolPref("menubar"),
  navbar:branch.getBoolPref("navbar"),
  bookmarbar:branch.getBoolPref("bookmarbar"),
  addonbar:branch.getBoolPref("addonbar"),
  init: function(){
    document.getElementById("on_fullscreen").checked = this.on_fullscreen;
    document.getElementById("mouse_button_group").selectedIndex = this.mouse_button;
    document.getElementById("menubar").checked = this.menubar;
    document.getElementById("navbar").checked = this.navbar;
    document.getElementById("bookmarbar").checked = this.bookmarbar;
    document.getElementById("addonbar").checked = this.addonbar;
  },
  set: function(){
    branch.setBoolPref("on_fullscreen", document.getElementById("on_fullscreen").checked);
    branch.setIntPref("mouse_button", document.getElementById("mouse_button_group").selectedIndex);
    branch.setBoolPref("menubar", document.getElementById("menubar").checked);
    branch.setBoolPref("navbar", document.getElementById("navbar").checked);
    branch.setBoolPref("bookmarbar", document.getElementById("bookmarbar").checked);
    branch.setBoolPref("addonbar", document.getElementById("addonbar").checked);
  }
}
function setPref(){
  tabNav.set();
}
window.addEventListener("load", function(){
  tabNav.init();
})
