var browserSearchService = window.arguments[0];
var installedEngines = browserSearchService.getEngines();
var prefs = window.arguments[1];
var currentIndex = -1;
var currentEngine = null;
var engineList=document.getElementById("engineList");
function buildSettedList(){
  var list = document.getElementById("engineList");
  for(var i = 0; i < installedEngines.length; i++){
    if(installedEngines[i].hidden) continue;
    var item = document.createElement("listitem");
    var cell1 = document.createElement("listcell");
    cell1.className = "listcell-iconic menuitem-with-favicon";
    cell1.setAttribute("image", installedEngines[i].iconURI.asciiSpec);
    cell1.setAttribute("label", installedEngines[i].name);
    var  cell2 = document.createElement("listcell");
    cell2.setAttribute("label", installedEngines[i].alias ? installedEngines[i].alias : "");
    item.appendChild(cell1);
    item.appendChild(cell2);
    list.appendChild(item);
  }
}
function init(){
  buildSettedList();
  bindEvents();
  document.getElementById("showTips").checked = prefs.showTips;
}
var listTrriger = false;
function bindEvents(){
  var engineList = document.getElementById("engineList");
  engineList.addEventListener("select",function(event){
    currentIndex = engineList.currentIndex;
    currentEngine = installedEngines[currentIndex];
    if(!listTrriger){
      listTrriger = true;
      document.getElementById("up-button").disabled=false;
      document.getElementById("down-button").disabled=false;
      document.getElementById("modify-button").disabled=false;
      document.getElementById("remove-button").disabled=false;
    }
    if(engineList.selectedIndex == 0){
      document.getElementById("up-button").disabled=true;
    }else{
      document.getElementById("up-button").disabled=false;

    }
    if(engineList.selectedIndex == engineList.itemCount-1){
      document.getElementById("down-button").disabled=true;
    }else{
      document.getElementById("down-button").disabled=false;
      
    }

  })
}
function setShowTips(){
  prefs.showTips = !prefs.showTips;
}
function moveUp(){
  var engineList = document.getElementById("engineList");
  var currentIndex = engineList.currentIndex;
  browserSearchService.moveEngine(currentEngine,currentIndex-1);
  var cels1 = engineList.selectedItem.children;
  var cels2 = engineList.selectedItem.previousSibling.children;
  var a1 = {image:cels1[0].getAttribute("image"),label:cels1[0].getAttribute("label"),alias:cels1[1].getAttribute("label")};
  var a2 = {image:cels2[0].getAttribute("image"),label:cels2[0].getAttribute("label"),alias:cels2[1].getAttribute("label")};
  cels1[0].setAttribute("image", a2.image);
  cels1[0].setAttribute("label", a2.label);
  cels1[1].setAttribute("label", a2.alias);
  cels2[0].setAttribute("image", a1.image);
  cels2[0].setAttribute("label", a1.label);
  cels2[1].setAttribute("label", a1.alias);
  engineList.selectItem( engineList.selectedItem.previousSibling );
}
function moveDown(){
  var engineList = document.getElementById("engineList");
  var currentIndex = engineList.currentIndex;
  browserSearchService.moveEngine(currentEngine,currentIndex+1);
  var cels1 = engineList.selectedItem.children;
  var cels2 = engineList.selectedItem.nextSibling.children;
  var a1 = {image:cels1[0].getAttribute("image"),label:cels1[0].getAttribute("label"),alias:cels1[1].getAttribute("label")};
  var a2 = {image:cels2[0].getAttribute("image"),label:cels2[0].getAttribute("label"),alias:cels2[1].getAttribute("label")};
  cels1[0].setAttribute("image", a2.image);
  cels1[0].setAttribute("label", a2.label);
  cels1[1].setAttribute("label", a2.alias);
  cels2[0].setAttribute("image", a1.image);
  cels2[0].setAttribute("label", a1.label);
  cels2[1].setAttribute("label", a1.alias);
  engineList.selectItem( engineList.selectedItem.nextSibling );
}
function removeItem(){
  browserSearchService.removeEngine(currentEngine);
  document.getElementById("engineList").removeItemAt( currentIndex );
}
function editKeyword(){
  var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                          .getService(Components.interfaces.nsIPromptService);

  var check = {value: false};                  // default the checkbox to false
  var input = {value: ""};                  // default the edit field to Bob
  var name = installedEngines[currentIndex].name;
  var result = prompts.prompt(null, "Title", "为\""+name+"\"输入新的关键字：", input, null, check);
  if(input.value.match(/^[a-z0-9A-Z]*$/)){
    document.getElementById("engineList").selectedItem.children[1].setAttribute("label",input.value);
    installedEngines[currentIndex].alias = input.value;
  }else{
    prompts.alert("关键字只能由字母和数字组合而成，不可以存在空格");
  }
}
function restore(){
  browserSearchService.restoreDefaultEngines();
  var list = document.getElementById("engineList");
  while(list.itemCount){
    list.removeItemAt(0);
  }
  buildSettedList();
}
window.addEventListener("load",init);
