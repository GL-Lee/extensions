var gl={};
gl.swoosh={};
(function(swoosh){
    Components.utils.import("resource://gre/modules/FileUtils.jsm");
    Components.utils.import("resource://gre/modules/NetUtil.jsm");
    //utils
    Components.utils.import("resource://swoosh/util.js", swoosh);
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
            model.init(this.buildEngineList);
            this.inited = true;
            this.setPosition();
            this.show();
            this.bindEvents();
        },
        buildEngineList: function(){
            var menupopup = view.menupopup;
            var innerHtml = "";
            var engineInfos = model.engineInfos;
            for(var i = 0; i < engineInfos.length; i++){
                var engineFlag = engineInfos[i].flag.split(",")[0];
                innerHtml+=("<menuitem class='menuitem-iconic' label='"+engineInfos[i].label+"' image= '"+engineInfos[i].logo+"' engineFlag='"+engineFlag+"'/>");
            }
            menupopup.innerHTML = innerHtml;
            var managerItem = document.createElement("menuitem");
            managerItem.setAttribute("label", "管理引擎");
            managerItem.setAttribute("engineFlag", "manager");
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
        init: function(callback){
            var file = FileUtils.getDir("ProfD", ["swoosh"], true);
            file.append("engineInfos.json");
            if(!file.exists()){
                file.create(app.fileConstantapp.FILE_TYPE,parseInt("0600",8));
            }
            var channel = NetUtil.newChannel(file);
            channel.contentType = "application/json";

            NetUtil.asyncFetch(channel, function(inputStream, status) {
                if (!Components.isSuccessCode(status)) {
                    // Handle error!
                    return;
                }
                var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());//You can call nsIInputStream.available() to get the number of bytes currently available
                model.engineInfos = JSON.parse(data);
                callback();
            });
        },
        setEngineUrl: function(engineFlag){
            if(!engineFlag) {
                this.engineUrl= this.defaultEngineUrl;
                return;
            }
            var engines = [];
            var engineInfos = this.engineInfos;
            for(var i = 0; i< engineInfos.length; i++){
                var array = engineInfos[i].flag.split(",");
                for(var j = 0; j < array.length; j++){
                    if(array[j] == engineFlag)
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
        var engineFlag = ""
        if(eventTarget){
           engineFlag = eventTarget.getAttribute("engineFlag");
           if(engineFlag == "manager"){
                window.openDialog("chrome://swoosh/content/manager.xul","manager" ,"chrome,centerscreen,all,modal" ,model.engineInfos);
                return;
           }
        }
        if(util.isUrl(str)){
            openSite(str);
        }else{
            searchStr(str,engineFlag);
        }
        view.panel.hidePopup();
    }
    function openSite(url){
        gBrowser.selectedTab = gBrowser.addTab(url);
    }
    function searchStr(string,engineFlag){
        var str = string;
        var flag = engineFlag;
        if(!flag){
            var array = str.split(";");
            if(array.length == 2){
                flag = array[array.length-1];
                flag = util.trim(flag);
                str = str.replace(/;.*/, "");
            }
        }
        model.setEngineUrl(flag);
        if(!model.engineUrl) model.engineUrl = model.defaultEngineUrl;
        var url = model.engineUrl+str;
        openSite(url);
    }
    swoosh.search = search;
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
