if(typeof swooshOverlay == "undefined"){
    var swooshOverlay={
        browserSearchService: null, 
        installedEngines: null,
        util: null,
        inputTags: "input,textarea,textbox",
        inSwoosh: false,
        strCon : "",
        tipItems:[],
        engineAlia:"",
        engineFlg:false,
        SwooshOn : true,
        prefs : {
            showTips:  true
        },
        IMEflg : false,
        view : {
            inited: false,
            panel: null,
            tipPanel: null,
            position: {},
            showed: false,
            init: function(){
                this.model = swooshOverlay.model;
                this.panel = document.getElementById("swoosh-panel");
                this.tipPanel = document.getElementById("swoosh-tip-panel");
                this.textbox = this.panel.firstChild.firstChild;
                this.textbox.value = "";
                // this.menupopup = this.textbox.firstChild.firstChild;
                // this.buildEngineList();
                this.buildTipPanel();
                this.inited = true;
                this.setPosition();
                this.bindEvents();
            },
            buildEngineList: function(){
                var menupopup = swooshOverlay.view.menupopup;
                var installedEngines = swooshOverlay.installedEngines;
                for(var i = 0; i < installedEngines.length; i++){
                    if(installedEngines[i].hidden) continue;
                    var item = document.createElement("menuitem");
                    item.className = "menuitem-iconic menuitem-with-favicon";
                    item.setAttribute("label", installedEngines[i].name);
                    item.setAttribute("image", installedEngines[i].iconURI.asciiSpec);
                    item.setAttribute("engineIndex", i);
                    menupopup.appendChild(item);
                }
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
                var j = 0;
                var row = "";
                var tipPanel = document.getElementById("swoosh-tip-panel");
                for(var i = 0; i< tipPanel.children.length; i++){
                    tipPanel.removeChild(tipPanel.children[i]);
                }
                var listbox = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul","listbox");
                var cols = document.createElement("listcols");

                var col = document.createElement("listcol");
                cols.appendChild(col);

               col = document.createElement("listcol");
                cols.appendChild(col);

               col = document.createElement("listcol");
                cols.appendChild(col);

                listbox.appendChild(cols);
                var installedEngines = swooshOverlay.installedEngines;

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
                    var item = document.createElement("listitem");
                    item.className = row;
                    var cell1 = document.createElement("listcell");
                    cell1.setAttribute("label", i+1);
                    var cell2 = document.createElement("listcell");
                    cell2.className = 'listcell-iconic menuitem-with-favicon';
                    cell2.setAttribute("image", installedEngines[i].iconURI.asciiSpec);
                    cell2.setAttribute("label", installedEngines[i].name);
                    var cell3 = document.createElement("listcell");
                    cell3.className = "swoosh-alias";
                    cell3.setAttribute("label", alia);
                    item.appendChild(cell1);
                    item.appendChild(cell2);
                    item.appendChild(cell3);
                    listbox.appendChild(item);
                }
                tipPanel.appendChild(listbox);
                swooshOverlay.tipItems = listbox.children;
            },
            show: function(){
                var view = swooshOverlay.view;
                if(!view.inited){
                    view.init()
                }
                swooshOverlay.initVar();
                this.panel.openPopup(null,"",this.position.left, this.position.top);
                // this.textbox.value = model.inputStr;
                // var len = model.inputStr.length;
                // this.textbox.setSelectionRange(len, len);
                this.textbox.value="";
                this.textbox.focus();
                var _this = this;
                setTimeout(function(){
                    if(!_this.textbox.value && !swooshOverlay.IMEflg){
                        _this.textbox.value = swooshOverlay.strCon;
                        swooshOverlay.strCon="";
                    }
                },20);
                this.showed = true;
            },
            hide: function(){
                swooshOverlay.view.panel&&swooshOverlay.view.panel.hidePopup();
                swooshOverlay.view.tipPanel&&swooshOverlay.view.tipPanel.hidePopup();
            },
            bindEvents: function(){
                var view = swooshOverlay.view;
                view.panel.addEventListener("popuphiding",function(){
                    view.showed = false;
                })
                view.textbox.addEventListener("keypress",function(event){
                    if(event.which == 13){//enter key
                        swooshOverlay.search();
                    }
                })
                view.tipPanel.addEventListener("popupshowing", function(){
                    document.getElementById('PopupAutoCompleteRichResult').hidePopup();
                });
                view.tipPanel.addEventListener("dblclick", function(){
                    window.openDialog("chrome://swoosh/content/manager.xul","manager" ,"chrome,centerscreen,all,modal" ,swooshOverlay.browserSearchService,swooshOverlay.prefs);
                    swooshOverlay.installedEngines = swooshOverlay.browserSearchService.getEngines();
                    view.buildTipPanel();
                    // if(prefs.showTips){
                    //     document.getElementById("swoosh-textbox").removeEventListener("keypress",showTips);
                    //     document.getElementById("swoosh-textbox").addEventListener("keypress",showTips);
                    // }else{
                    //     document.getElementById("swoosh-textbox").removeEventListener("keypress",showTips);
                    // }
                });
                document.getElementById('PopupAutoCompleteRichResult').addEventListener("popupshowing", function(){
                    view.tipPanel.hidePopup();
                });
            },
            setPosition: function(){
                var left = 0;
                var top = parseInt(window.getComputedStyle(document.getElementById("navigator-toolbox"), null)["height"]);
                this.position.left = left;
                this.position.top = top;
            }
        },
        model : {
            inputStr: "",
            view: null,
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
                    swooshOverlay.view.showEngineOption(engines);
                }
            }
        },
        initVar: function(){
            swooshOverlay.IMEflg = false;
            swooshOverlay.engineAlia="";
            swooshOverlay.engineFlg=false;
            // document.getElementById("swoosh-tip-panel").children[0].clearSelection();
        },
        search: function(eventTarget){
            var view = swooshOverlay.view;
            var str = view.textbox.value;
            var alia = ""
            if(eventTarget){
               alia = eventTarget.getAttribute("alia");
               if(alia == "manager"){
                    var browserSearchService = swooshOverlay.browserSearchService;
                    browserSearchService = Components.classes["@mozilla.org/browser/search-service;1"].getService(Components.interfaces.nsIBrowserSearchService); 
                    var engineCount = 0;
                    browserSearchService.init();
                    swooshOverlay.installedEngines = browserSearchService.getEngines();
                    window.openDialog("chrome://swoosh/content/manager.xul","manager" ,"chrome,centerscreen,all,modal" ,browserSearchService,prefs);
                    swooshOverlay.installedEngines = browserSearchService.getEngines();
                    // view.buildEngineList();
                    view.buildTipPanel();
                    // if(prefs.showTips){
                    //     document.getElementById("swoosh-textbox").addEventListener("keypress",showTips);
                    // }else{
                    //     document.getElementById("swoosh-textbox").removeEventListener("keypress",showTips);
                    // }
                    return;
               }
               if(eventTarget.tagName.toLowerCase() == "menuitem"){
                    alia = parseInt(eventTarget.getAttribute("engineIndex"))+1+"";
               }
            }
            if(!str) return;
            var success = false;
            if(swooshOverlay.util.isUrl(str)){
                success = swooshOverlay.openSite(str);
            }else{
                success = swooshOverlay.searchStr(str,alia);
            }
            if(success){
                view.hide();
            }
        },
        openSite: function(url){
            gBrowser.selectedTab = gBrowser.addTab(url);
            return true;
        },
        searchStr: function(string,alia){
            var str = string;
            if(!alia){
                var temp = "";
                alia = str.match(/;([a-z0-9]*)($| )/);
                if(alia){
                    temp = alia[0];
                    alia = swooshOverlay.util.trim(alia[1]);
                    str = str.replace(temp, "");
                }
             }
            var engine;
            if(!alia){
                engine = swooshOverlay.installedEngines[0];
            }else{
                if(alia.match(/^\d+$/)){
                    engine = swooshOverlay.installedEngines[parseInt(alia)-1]
                }else{
                    engine = swooshOverlay.browserSearchService.getEngineByAlias(alia)
                }
            }
            if(engine){
                var url = engine.getSubmission(str).uri.asciiSpec;
                swooshOverlay.openSite(url);
                return true;
            }else{
                return false;
            }
        },
        initPrefs: function(){
                var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
                var branch = prefService.getBranch("extensions.swoosh.");
                swooshOverlay.prefs.showTips = branch.getBoolPref("showTips");
        },
        savePrefs: function(){
            var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
            var branch = prefService.getBranch("extensions.swoosh.");
            branch.setBoolPref("showTips",prefs.showTips);
        },
        showTips: function(event){
            var keycode = event.which;
            setTimeout(function(){
                var view = swooshOverlay.view;
                var engineAlia = swooshOverlay.engineAlia;
                var tipItems = swooshOverlay.tipItems;
                if(swooshOverlay.engineFlg){
                    var searchStr = view.textbox.value;
                    if(!searchStr){
                        view.tipPanel.hidePopup();
                        return;
                    }
                    var index = searchStr.lastIndexOf(";");
                    if(index > 0){
                        engineAlia = searchStr.substr(index+1);
                    }else{
                        engineAlia = "";
                    }
                    var listbox = view.tipPanel.children[0];
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
                }
                if(keycode == 59 && !event.ctrlKey && !event.shiftKey){//';'=59
                    view.tipPanel.openPopup(view.textbox,"after_start");
                    view.tipPanel.children[0].clearSelection();
                    view.textbox.focus();
                    var len = view.textbox.value.length;
                    view.textbox.setSelectionRange(len,len);
                    swooshOverlay.engineFlg = true;
                    engineAlia="";
                    return;
                }
            },60)
        },
        keydownListener: function(event){
            if(!swooshOverlay.SwooshOn) return;
            var keycode = event.which;
            if(keycode < 48 || keycode > 105) return;
            if(event.altKey || event.metaKey) return;
            if(swooshOverlay.inSwoosh) return;
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
            swooshOverlay.view.show();
        },
        keypressListener: function(event){
            if(event.ctrlKey || event.altKey) return;
            var keycode = event.which;
            if(event.target.tagName.toLowerCase() != "body" ) return;
            swooshOverlay.strCon = String.fromCharCode(keycode);
        },
        compositionlistener: function(event){
            swooshOverlay.IMEflg = true;
        },
        addKeyListener: function(){
            window.addEventListener("keydown",swooshOverlay.keydownListener);
            window.addEventListener("keypress",swooshOverlay.keypressListener);
            window.addEventListener("compositionstart",function(){swooshOverlay.IMEflg = true});
            window.addEventListener("compositionend",function(){swooshOverlay.IMEflg = false});
        },
        removeKeyListener: function(){
            window.removeEventListener("keydown",swooshOverlay.keydownListener);
            window.removeEventListener("keypress",swooshOverlay.keypressListener);
        },
        toggleSwoosh: function(){
            swooshOverlay.SwooshOn = !swooshOverlay.SwooshOn;
            if(swooshOverlay.SwooshOn){
                swooshOverlay.addKeyListener();
                document.getElementById("swoosh-switch-button").setAttribute("swooshstate","on")
            }else{
                swooshOverlay.removeKeyListener();
                document.getElementById("swoosh-switch-button").setAttribute("swooshstate","off")
                swooshOverlay.view.hide();
            }
        },
        fun: function(){
            Components.utils.import("resource://gre/modules/FileUtils.jsm");
            Components.utils.import("resource://gre/modules/NetUtil.jsm");
            //utils
            Components.utils.import("resource://swoosh/util.js", swooshOverlay);
            function destroy(){

            }
            swooshOverlay.addKeyListener();
            window.addEventListener("keydown",function(event){
                var keycode = event.which;
                if(keycode == 59 && event.ctrlKey){
                    if(event.shiftKey){
                        swooshOverlay.toggleSwoosh();
                    }else{
                        swooshOverlay.strCon=""
                        swooshOverlay.view.show();
                    }
                }
            })
            // window.addEventListener("unload",function(){
            //     savePrefs();
            // })
        }
    };
    window.addEventListener("load",function(){
        swooshOverlay.browserSearchService = Components.classes["@mozilla.org/browser/search-service;1"].getService(Components.interfaces.nsIBrowserSearchService); 
        swooshOverlay.browserSearchService.init();
        swooshOverlay.installedEngines = swooshOverlay.browserSearchService.getEngines();
        swooshOverlay.initPrefs();
        if(swooshOverlay.prefs.showTips){
            document.getElementById("swoosh-textbox").addEventListener("keypress",swooshOverlay.showTips);
        }
        swooshOverlay.fun();
    });
}
