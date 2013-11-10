var engineInfos = window.arguments[0];
function buildList(){
  var innerHtml = "";
  for(var i = 0; i < engineInfos.length; i++){
    innerHtml+= ("<listitem><listcell class='listcell-iconic' image='"+engineInfos[i].logo+"' label='"+engineInfos[i].label+"'/></listitem>");
  }
  var engineList = document.getElementById("engineList");
  engineList.innerHTML = engineList.innerHTML + innerHtml;
}
function init(){
  buildList();
  bindEvents();
}
var listTrriger = false;
function bindEvents(){

  var list = document.getElementById("engineList");
  list.addEventListener("select",function(event){
    if(!listTrriger){
      listTrriger = true;
      document.getElementById("up-button").disabled=false;
      document.getElementById("down-button").disabled=false;
      document.getElementById("modify-button").disabled=false;
      document.getElementById("remove-button").disabled=false;
    }
    if(list.selectedIndex == 0){
      document.getElementById("up-button").disabled=true;
    }else{
      document.getElementById("up-button").disabled=false;

    }
    if(list.selectedIndex == list.itemCount-1){
      document.getElementById("down-button").disabled=true;
    }else{
      document.getElementById("down-button").disabled=false;
      
    }

  })
}
window.addEventListener("load",init);
