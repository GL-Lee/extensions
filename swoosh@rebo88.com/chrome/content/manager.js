var browserSearchService = window.arguments[0];
var installedEngines = browserSearchService.getEngines();
var currentIndex = -1;
var currentEngine = null;
var engineList=document.getElementById("engineList");
function buildSettedList(){
  var innerHtml = "";
  for(var i = 0; i < installedEngines.length; i++){
    var str = "<listitem>"+
                "<listcell class='listcell-iconic' image='"+installedEngines[i].iconURI.asciiSpec+"' label='"+installedEngines[i].name+"'/>"+
                "<listcell label='"+(installedEngines[i].alias?installedEngines[i].alias:"")+"'/>"+
              "</listitem>";
    innerHtml+= str;
  }
  var engineList = document.getElementById("engineList");
  engineList.innerHTML = engineList.innerHTML + innerHtml;
}
function init(){
  buildSettedList();
  bindEvents();
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
function moveUp(){
  browserSearchService.moveEngine(currentEngine,currentIndex-1);
  document.getElementById("engineList").moveByOffset( 1 , true, true);
  alert(1);
}
function moveDown(){
  browserSearchService.moveEngine(currentEngine,currentIndex+1);
  var engineList = document.getElementById("engineList");
  var cels1 = engineList.currentItem.children;
  var cels2 = engineList.currentItem.nextSibling.children;
  var a1 = {image:cels1[0].getAttribute("image"),label:cels1[0].getAttribute("label"),alias:cels1[1].getAttribute("label")};
  var a2 = {image:cels2[0].getAttribute("image"),label:cels2[0].getAttribute("label"),alias:cels2[1].getAttribute("label")};
  cels1[0].setAttribute("image", a2.image);
  cels1[0].setAttribute("label", a2.label);
  cels1[1].setAttribute("label", a2.alias);
  cels2[0].setAttribute("image", a1.image);
  cels2[0].setAttribute("label", a1.label);
  cels2[1].setAttribute("label", a1.alias);
}
function removeItem(){
  browserSearchService.removeEngine(currentEngine);
  document.getElementById("engineList").removeItemAt( currentIndex );
}
function editKeyword(){

}
window.addEventListener("load",init);
