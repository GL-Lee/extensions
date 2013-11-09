var gl={};
gl.swoosh={};
(function(swoosh){
    //utils
    Components.utils.import("resource://swoosh/util.js", swoosh);
    var util = swoosh.util;
    var inputTags = "input,textarea,textbox";
    var inSwoosh = false;
    var engineInfos = [
        {
            engineName:"baidu",
            hotkeyCode:49,
            label:"百度",
            logo:"chrome://swoosh/content/image/logo-bd.png",
            background:"url(chrome://swoosh/content/image/baidu-bg60.jpg)",
            engineUrl:"http://www.baidu.com/s?wd=",
            flag:"b,bd,baidu"
        },
        {
            engineName:"google",
            hotkeyCode:50,
            label:"谷歌",
            logo:"chrome://swoosh/content/image/logo-g.png",
            background:"url(chrome://swoosh/content/image/google-bg60.jpg)",
            engineUrl:"http://www.google.com.hk/#newwindow=1&q=",
            flag:"g,google"
        },
        {
            engineName:"taobao",
            hotkeyCode:51,
            label:"淘宝",
            logo:"chrome://swoosh/content/image/logo-tb.png",
            background:"url(chrome://swoosh/content/image/taobao-bg60.jpg)",
            engineUrl:"http://s.taobao.com/search?q=",
            flag:"t,tb,taobao"
        },
        {
            engineName:"jingdong",
            hotkeyCode:52,
            label:"京东",
            logo:"chrome://swoosh/content/image/logo-jd.png",
            background:"url(chrome://swoosh/content/image/jingdong-bg60.jpg)",
            engineUrl:"http://search.jd.com/Search?keyword=",
            flag:"j,jd,jingdong"
        }
    ]
    var view = {
        inited: false,
        panel: null,
        position: {},
        init: function(){
            this.model = model;
            var panel = this.panel = document.getElementById("swoosh-panel");
            var textbox = this.textbox = panel.firstChild.firstChild;
            textbox.value = "";
            var menupopup = this.menupopup = textbox.firstChild.firstChild;
            var innerHtml = "";
            for(var i = 0; i < engineInfos.length; i++){
                innerHtml+=("<menuitem class='menuitem-iconic' label='"+engineInfos[i].label+"' image= '"+engineInfos[i].logo+"'/>");
            }
            menupopup.innerHTML = innerHtml;
            this.inited = true;
            this.setPosition();
            this.show();
            this.bindEvents();
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
        setEngineUrl: function(engineFlag){
            if(!engineFlag) {
                this.engineUrl= this.defaultEngineUrl;
                return;
            }
            var engines = [];
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
    function search(){
        var str = view.textbox.value;
        if(!str) return;
        var flag = "";
        if(util.isUrl(str)){
            openSite(str);
        }else{
            searchStr(str);
        }
        view.panel.hidePopup();
    }
    function openSite(url){
        gBrowser.selectedTab = gBrowser.addTab(url);
    }
    function searchStr(string){
        var str = string;
        var array = str.split(";");
        var flag = "";
        if(array.length == 2){
            flag = array[array.length-1];
            flag = util.trim(flag);
            model.setEngineUrl(flag);
            str = str.replace(/;.*/, "");
        }
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
