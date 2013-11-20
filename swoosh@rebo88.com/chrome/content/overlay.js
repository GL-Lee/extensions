if(typeof gl == "undefined"){
    var gl={};
}
if(typeof gl.swoosh == "undefined"){
    gl.swoosh={};
}
(function(swoosh){
    Components.utils.import("resource://gre/modules/FileUtils.jsm");
    Components.utils.import("resource://gre/modules/NetUtil.jsm");
    //utils
    Components.utils.import("resource://swoosh/util.js", swoosh);
    var browserSearchService; 
    var installedEngines;
    var util = swoosh.util;
    var inputTags = "input,textarea,textbox";
    var inSwoosh = false;
    var strCon = "";
    var tipItems=[];
    var engineAlia="";
    var engineFlg=false;
    var tipPanel=null;
    var view = {
        inited: false,
        panel: null,
        position: {},
        init: function(){
            this.model = model;
            this.panel = document.getElementById("swoosh-panel");
            this.textbox = this.panel.firstChild.firstChild;
            this.textbox.value = "";
            this.menupopup = this.textbox.firstChild.firstChild;
            this.buildEngineList();
            this.buildTipPanel();
            this.inited = true;
            this.setPosition();
            this.show();
            this.bindEvents();
        },
        buildEngineList: function(){
            var menupopup = view.menupopup;
            var innerHtml = "";
            for(var i = 0; i < installedEngines.length; i++){
                if(installedEngines[i].hidden) continue;
                innerHtml+=("<menuitem class='menuitem-iconic menuitem-with-favicon' label='"+installedEngines[i].name+"' image= '"+installedEngines[i].iconURI.asciiSpec+"' engineIndex='"+i+"'/>");
            }
            menupopup.innerHTML = innerHtml;
            var sep = document.createElement("menuseparator");
            menupopup.appendChild(sep);
            var managerItem = document.createElement("menuitem");
            var stringsBundle = document.getElementById("swoosh-stringbundle");
            var manageEngines = stringsBundle.getString('swoosh.manageEngines') + " ";
            managerItem.setAttribute("label", manageEngines);
            managerItem.setAttribute("alia", "manager");
            // managerItem.setAttribute("oncommand", 'window.open("chrome://swoosh/content/manager.xul",null ,"modal" ,modal.engineInfos)');
            menupopup.appendChild(managerItem);
        },
        buildTipPanel:function(){
          var innerHtml =   "<listcols>"+
                                "<listcol/>"+
                                "<listcol/>"+
                                "<listcol/>"+
                            "</listcols>";
          var j = 0;
          var row = "";
          for(var i = 0; i < installedEngines.length; i++){
            if(installedEngines[i].hidden) continue;
            if(j == 0){
                row = "swoosh-even";
                j++;
            }else{
                row = "swoosh-odd";
                j--;
            }
            var alia = installedEngines[i].alias?installedEngines[i].alias:"";
            var str = "<listitem class='"+row+"'>"+
                        "<listcell label='"+(i+1)+"'/>"+
                        "<listcell class='listcell-iconic menuitem-with-favicon' image='"+installedEngines[i].iconURI.asciiSpec+"' label='"+installedEngines[i].name+"'/>"+
                        "<listcell class='swoosh-alias' label='"+alia+"'/>"+
                      "</listitem>";
            innerHtml+= str;
          }
          var engineList = document.getElementById("swoosh-tip-panel").children[0];
          engineList.innerHTML = innerHtml;
          tipItems = document.getElementById("swoosh-tip-panel").children[0].children;
        },
        show: function(){
            initVar();
            this.panel.openPopup(null,"",this.position.left, this.position.top);
            // this.textbox.value = model.inputStr;
            // var len = model.inputStr.length;
            // this.textbox.setSelectionRange(len, len);
            this.textbox.value="";
            this.textbox.focus();
            var _this = this;
            setTimeout(function(){
                if(!_this.textbox.value){
                    _this.textbox.value = strCon;
                }
            },20);
        },
        bindEvents: function(){
        },
        setPosition: function(){
            var left = 0;
            var top = parseInt(window.getComputedStyle(document.getElementById("navigator-toolbox"), null)["height"]);
            this.position.left = left;
            this.position.top = top;
        }
    }
    var model = {
        inputStr: "",
        view: view,
        defaultEngineUrl:"http://www.baidu.com/s?wd=",
        engineUrl: "",
        engineInfos: [],
        firstkeycode:-1,
        init: function(){
        },
        setEngineUrl: function(alia){
            if(!alia) {
                this.engineUrl= this.defaultEngineUrl;
                return;
            }
            var engines = [];
            var engineInfos = this.engineInfos;
            for(var i = 0; i< engineInfos.length; i++){
                var array = engineInfos[i].alia.split(",");
                for(var j = 0; j < array.length; j++){
                    if(array[j] == alia)
                    engines.push(engineInfos[i]);
                }
            }
            if(engines.length == 1){
                this.engineUrl = engines[0].engineUrl;
            }else{
                view.showEngineOption(engines);
            }
        }
    }
    function initVar(){
        engineAlia="";
        engineFlg=false;
        tipPanel.children[0].clearSelection();
    }
    function search(eventTarget){
        var str = view.textbox.value;
        var alia = ""
        if(eventTarget){
           alia = eventTarget.getAttribute("alia");
           if(alia == "manager"){
                browserSearchService = Components.classes["@mozilla.org/browser/search-service;1"].getService(Components.interfaces.nsIBrowserSearchService); 
                var engineCount = 0;
                browserSearchService.init();
                installedEngines = browserSearchService.getEngines();
                window.openDialog("chrome://swoosh/content/manager.xul","manager" ,"chrome,centerscreen,all,modal" ,browserSearchService);
                installedEngines = browserSearchService.getEngines();
                view.buildEngineList();
                view.buildTipPanel();
                return;
           }
           if(eventTarget.tagName.toLowerCase() == "menuitem"){
                alia = parseInt(eventTarget.getAttribute("engineIndex"))+1+"";
           }
        }
        if(!str) return;
        var success = false;
        if(util.isUrl(str)){
            success = openSite(str);
        }else{
            success = searchStr(str,alia);
        }
        if(success){
            view.panel.hidePopup();
            tipPanel.hidePopup();
            model.firstkeycode = -1;
        }
    }
    function openSite(url){
        gBrowser.selectedTab = gBrowser.addTab(url);
        return true;
    }
    function searchStr(string,alia){
        var str = string;
        if(!alia){
            var temp = "";
            alia = str.match(/;([a-z0-9]*)($| )/);
            if(alia){
                temp = alia[0];
                alia = util.trim(alia[1]);
                str = str.replace(temp, "");
            }
         }
        var engine;
        if(!alia){
            engine = installedEngines[0];
        }else{
            if(alia.match(/^\d+$/)){
                engine = installedEngines[parseInt(alia)-1]
            }else{
                engine = browserSearchService.getEngineByAlias(alia)
            }
        }
        if(engine){
            var url = engine.getSubmission(str).uri.asciiSpec;
            openSite(url);
            return true;
        }else{
            return false;
        }
    }
    swoosh.search = search;
    window.addEventListener("load",function(){
        browserSearchService = Components.classes["@mozilla.org/browser/search-service;1"].getService(Components.interfaces.nsIBrowserSearchService); 
        browserSearchService.init();
        installedEngines = browserSearchService.getEngines();
        tipPanel = document.getElementById("swoosh-tip-panel");
        document.getElementById("swoosh-textbox").addEventListener("keypress",function(event){
            var keycode = event.which;
            if(engineFlg){
                setTimeout(function(){
                    var searchStr = view.textbox.value;
                    var index = searchStr.lastIndexOf(";");
                    if(index > 0){
                        engineAlia = searchStr.substr(index+1);
                    }else{
                        engineAlia = "";
                    }
                    var listbox = tipPanel.children[0];
                    if(engineAlia.match(/\d+/)){
                        listbox.selectItem( tipItems[parseInt(engineAlia)] );
                    }else{
                        for(var i = 0;i < tipItems.length; i++){
                            var listitem = tipItems[i].children[2];
                            if(listitem.getAttribute("label") == engineAlia){
                                listbox.selectItem( tipItems[i] );
                            }
                        }
                    }
                },20)
            }
            if(keycode == 59){//';'=59
                document.getElementById("swoosh-tip-panel").openPopup(event.currentTarget,"after_start");
                event.currentTarget.inputField.focus();
                engineFlg = true;
                engineAlia="";
            }
        })
    })
    window.addEventListener("keydown",function(event){
        var keycode = event.which;
        if(keycode < 48 || keycode > 105) return;
        if(event.altKey || event.metaKey) return;
        if(inSwoosh) return;
        if(event.ctrlKey){
            if(keycode != 86){//86 = 'v' keycode
                return;
            }
        }
        if(event.target.tagName.toLowerCase() != "body" || event.view != event.view.parent) return;
        // if(!event.shiftKey && keycode > 65 &&){
        //     strCon = String.fromCharCode(keycode+32);
        // }else{
        //     strCon = String.fromCharCode(keycode);
        // }
        if(model.firstkeycode<0){
            model.firstkeycode = keycode;
        }
        if(view.inited){
            view.show()
        } else{
            view.init()
        }
    })
    window.addEventListener("keypress",function(event){
        var keycode = event.which;
        if(event.target.tagName.toLowerCase() != "body" ) return;
        strCon = String.fromCharCode(keycode);
    })
})(gl.swoosh);
