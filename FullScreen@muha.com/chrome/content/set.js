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
  bottomTrigger:branch.getBoolPref("bottom_trigger"),
  init: function(){
    // document.getElementById("on_fullscreen").checked = this.on_fullscreen;
    var mouse_button = this.mouse_button;
    if(mouse_button ==99 || mouse_button == -1) mouse_button =3;
    document.getElementById("mouse_button_group").selectedIndex = mouse_button;
    document.getElementById("menubar").checked = this.menubar;
    document.getElementById("navbar").checked = this.navbar;
    document.getElementById("bookmarbar").checked = this.bookmarbar;
    document.getElementById("addonbar").checked = this.addonbar;
    document.getElementById("bottom-trigger").checked = this.bottomTrigger;
  },
  set: function(){
    // branch.setBoolPref("on_fullscreen", document.getElementById("on_fullscreen").checked);
    var button = document.getElementById("mouse_button_group").selectedIndex;
    if(button == 3) button = 99;
    branch.setIntPref("mouse_button", button);
    branch.setBoolPref("menubar", document.getElementById("menubar").checked);
    branch.setBoolPref("navbar", document.getElementById("navbar").checked);
    branch.setBoolPref("bookmarbar", document.getElementById("bookmarbar").checked);
    branch.setBoolPref("addonbar", document.getElementById("addonbar").checked);
    branch.setBoolPref("bottom_trigger", document.getElementById("bottom-trigger").checked);
  }
}
function setPref(){
  tabNav.set();
}
window.addEventListener("load", function(){
  tabNav.init();
})
