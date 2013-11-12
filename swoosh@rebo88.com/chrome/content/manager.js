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
  var item = engineList.currentItem.innerHTML;
  engineList.removeItemAt(currentIndex);
  var d = engineList.insertItemAt(currentIndex);
  d.innerHTML=item;
  setTimeout(500,function(){
    alert(d.innerHTML);
  });
}
function removeItem(){
  browserSearchService.removeEngine(currentEngine);
  document.getElementById("engineList").removeItemAt( currentIndex );
}
function editKeyword(){

}
window.addEventListener("load",init);
