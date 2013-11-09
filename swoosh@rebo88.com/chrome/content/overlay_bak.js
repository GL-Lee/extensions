(function(){
    var modifier = ["Control"];
    var panelWidth = 454;
    var panelHeight = 85;
    var panel=null;
    var map = [
        {
            engineName:"baidu",
            hotkeyCode:49,
            logo:"",
            background:"url(chrome://swoosh/content/image/baidu-bg60.jpg)"
        },
        {
            engineName:"google",
            hotkeyCode:50,
            logo:"",
            background:"url(chrome://swoosh/content/image/google-bg60.jpg)"

        },
        {
            engineName:"taobao",
            hotkeyCode:51,
            logo:"",
            background:"url(chrome://swoosh/content/image/taobao-bg60.jpg)"
        },
        {
            engineName:"jingdong",
            hotkeyCode:52,
            logo:"",
            background:"url(chrome://swoosh/content/image/jingdong-bg60.jpg)"
        }
    ]
    function searchModel(engine,searchStr) {  
        this._engine = engine;        // 所有元素  
        this._searchStr = '';   // 被选择元素的索引  
    }  
    searchModel.prototype = {
        search : function(){

        },       
        cancelSearch : function () {  
        }
    };
    function searchView(model){
        this._panel = document.getElementById("swoosh-panel");
        this._model = model;
    }
    searchView.prototype = {
        renderPanel : function(){
            var model = this._model;
            var panel = this._panel;
            panel.style.background = model._engine.background;
            var logo = document.getElementById("swoosh-engine-logo");
            logo.src=model.logo;
        },
        show : function(){
            var win = document.getElementById("main-window");
            var left = (win.clientWidth- panelWidth)/2;
            var top = (win.clientHeight - panelHeight)/2;
            this._panel.openPopupAtScreen(left, top);
        },
        setSearchStr : function(searchStr){
            this._model._searchStr = searchStr;
        },
        setEngine : function(engine){
            if(typeof(engine) == "object"){
                this._model._engine = engine;
            }else{
                this._model._engine = new searchEngine(engine);
            }

        }
    }
    function setHotkey(){
        for(var i = 0; i < modifier.length; i++){
        }
    }
    function setEngineMenu(){
        var menu = document.getElementById("swoosh-engine-menu");

    }
    function bindEvents(){
        bindMouseEvents();
        bindKeyboardEvents();
        // document.getElementById("swoosh-engine-menu").addEventListener("click",setEngineMenu);
    }
    function bindMouseEvents(){

    }
    function bindKeyboardEvents(){

    }
    function buildSearch(keyCode){
        var engine = null;
        for(var i = 0; i< map.length; i++){
            if(map[i].hotkeyCode == keyCode){
                engine = map[i];
                break;
            }
        }
        if(engine){
            var model = new searchModel(engine);
            var view = new searchView(model);
            view.renderPanel();
            view.show();
       }
    }
    window.addEventListener("keypress",function(event){
        for(var i = 0; i < modifier.length; i++){
            if(!event.getModifierState(modifier[i])) return;
        }
        buildSearch(event.which);
    })
    window.addEventListener("load",function(){
        setEngineMenu();
    })
})();
