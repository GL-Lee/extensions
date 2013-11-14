var gl={};
gl.swoosh={};
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
            var managerItem = document.createElement("menuitem");
            managerItem.setAttribute("label", "管理引擎");
            managerItem.setAttribute("alia", "manager");
            // managerItem.setAttribute("oncommand", 'window.open("chrome://swoosh/content/manager.xul",null ,"modal" ,modal.engineInfos)');
            menupopup.appendChild(managerItem);
        },
        show: function(){
            this.panel.openPopup(null,"",this.position.left, this.position.top);
            this.textbox.value = model.inputStr;
            var len = model.inputStr.length;
            this.textbox.setSelectionRange(len, len);
            this.textbox.focus();
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
    function search(eventTarget){
        var str = view.textbox.value;
        if(!str) return;
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
                return;
           }
           if(eventTarget.tagName.toLowerCase() == "menuitem"){
                alia = parseInt(eventTarget.getAttribute("engineIndex"))+1+"";
           }
        }
        if(util.isUrl(str)){
            openSite(str);
        }else{
            searchStr(str,alia);
        }
        view.panel.hidePopup();
    }
    function openSite(url){
        gBrowser.selectedTab = gBrowser.addTab(url);
    }
    function searchStr(string,alia){
        var str = string;
        if(!alia){
            var array = str.split(";");
            if(array.length == 2){
                alia = array[array.length-1];
                alia = util.trim(alia);
                str = str.replace(/;.*/, "");
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
        var url = engine.getSubmission(str).uri.asciiSpec;
        openSite(url);
    }
    swoosh.search = search;
    window.addEventListener("load",function(){
        browserSearchService = Components.classes["@mozilla.org/browser/search-service;1"].getService(Components.interfaces.nsIBrowserSearchService); 
        browserSearchService.init();
        installedEngines = browserSearchService.getEngines();
    })
    window.addEventListener("keypress",function(event){
        if(event.altKey || event.metaKey) return;
        if(inSwoosh) return;
        if(event.ctrlKey){
            if(event.which != 118){//86 = 'v' keycode
                return;
            }
        }else{
            model.inputStr=String.fromCharCode(event.which);
        }
        if(event.target.tagName.toLowerCase() != "body" ) return;
        if(view.inited){
            view.show()
        } else{
            view.init()
        }
    })
})(gl.swoosh);
