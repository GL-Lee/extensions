var engineInfos = window.arguments[0];
function buildList(){
  var innerHtml = "";
  for(var i = 0; i < engineInfos.length; i++){
    innerHtml+= ("<listitem><listcell class='listcell-iconic' image='"+engineInfos[i].logo+"' label='"+engineInfos[i].label+"'/></listitem>");
  }
  var engineList = document.getElementById("engineList");
  engineList.innerHTML = engineList.innerHTML + innerHtml;
}
window.addEventListener("load",buildList);

/*


  	var descEle;
  	var selectorEle;
    var state = "";
  	function change(){
      if(state == "add"){
        addRule(panel.firstChild.children[0].value, panel.firstChild.children[1].value);
      }
      if(state == "change"){
        changeRule();
      }
  		panel.hidePopup();
 	  }
    function addRule(desc, selector){
      var listitem = document.createElement("listitem");
      var html =  '<listcell width="240">'+
                      '<label value="'+desc+'"/>'+
                    '</listcell>'+
                    '<listcell>'+
                      '<label value="'+selector+'"/>'+
                    '</listcell>';
      listitem.innerHTML = html;
      list.appendChild(listitem);
      // $(html).appendTo($("#theList");
    }
    function changeRule(){
      descEle.firstChild.value = panel.firstChild.children[0].value;
      selectorEle.firstChild.value = panel.firstChild.children[1].value;
    }
    function set(){
      var listitems = document.getElementsByTagName("listitem");
      var rules = {};
      var dataSelector = {};
      for(var i = 0; i < listitems.length; i++){
        var desc = listitems[i].children[0].children[0].value;
        var selector = listitems[i].children[1].children[0].value;
        if(desc){
          dataSelector[desc] = selector;
        }
      }
      var mutationSelector = document.getElementById("mutation_selector").value;
      rules.dataSelector = dataSelector;
      rules.mutationSelector = mutationSelector;
      window.rules.dataSelector = rules;
      win
    }
    window.addEventListener("load",function(){
      panel = document.getElementById("changepanel");
      list = document.getElementById("theList");
      document.getElementById("mutation_selector").value = window.opener.sets.mutationSelector;

      var rules = window.opener.sets.dataSelector;
      for(var r in rules){
        addRule(r, rules[r]);
      }
      list.addEventListener("dblclick",function(event){
        var ele = event.target;
        descEle = ele.children[0];
        selectorEle = ele.children[1];
        panel.firstChild.children[0].value = descEle.firstChild.value;
        panel.firstChild.children[1].value = selectorEle.firstChild.value;
        state = "change";
        panel.openPopup( ele , "after_start" )
      })
      document.getElementById("add_rule_button").addEventListener("click",function(event){
        var ele = event.target;
        state = "add";
        panel.openPopup( ele , "before_start" )
      })
    })
*/