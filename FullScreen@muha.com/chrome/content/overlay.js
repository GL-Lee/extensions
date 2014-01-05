if(typeof GLFullScreen == "undefined"){
    var GLFullScreen={
        navigatorPanel: null,
        navigator: null,
        position:{left:0,top:0},
        nav:{
            navStart: false,
            pixH:50,
            pixV:5,
            startPosition:{
                x:0,
                y:0
            },
            mouse_button:2,
            on_fullscreen:false,
            mouseheld:false,
            navPanel:null,
            navPanelWidth:24,
            init:function(){
                var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
                var branch = prefService.getBranch("extensions.fullscreen.");
                this.on_fullscreen = branch.getBoolPref("on_fullscreen");
                this.mouse_button = branch.getIntPref("mouse_button");
                this.navPanel = document.getElementById("gl-fullscreen-tab-nav");
                this.turnOn();
            },
            navTab: function(nowPoint){
                if(nowPoint.x - this.startPosition.x > this.pixH){
                    gBrowser.tabContainer.advanceSelectedTab(1, true);
                    this.startPosition.x = nowPoint.x;
                    this.startPosition.y = nowPoint.y;
                }
                if(nowPoint.x - this.startPosition.x < -this.pixH){
                    gBrowser.tabContainer.advanceSelectedTab(-1, true);
                    this.startPosition.x = nowPoint.x;
                    this.startPosition.y = nowPoint.y;
                }
            },
            mousedown:function(){
                var nav = GLFullScreen.nav;
                var event = arguments[0];
                if(event.button != nav.mouse_button || (nav.on_fullscreen && !window.fullScreen) ) return;
                nav.startPosition.x = event.clientX;
                nav.startPosition.y = event.clientY;
                nav.mousedowned = true;
                if(event.button == nav.mouse_button && !window.getBrowserSelection()){
                    setTimeout(function(){
                        if(nav.mousedowned){
                            if(window.fullScreen){
                                GLFullScreen.showNav();                    
                            }
                            // document.getElementById("main-window").style.cursor = "url(image/tabNav.png) 2 2, pointer";
                            nav.navPanel.openPopupAtScreen( event.screenX - nav.navPanelWidth/2, event.screenY - nav.navPanelWidth/2);
                            nav.navPanel.className="gl-fullscreen-hovered";
                            window.addEventListener("mousemove", nav.mousemove);
                            nav.mouseheld = true;
                        }
                    }, 200)
                }
            },
            mouseup:function(){
                var nav = GLFullScreen.nav;
                var event = arguments[0];
                nav.mousedowned = false;
                if(nav.mouseheld){
                    event.stopPropagation();
                    event.preventDefault();
                    GLFullScreen.navigatorPanel.hidePopup();
                }
                setTimeout(function(){
                    nav.navPanel.className="";
                    nav.navPanel.hidePopup();
                    nav.mouseheld = false;
                },10)
                window.removeEventListener("mousemove", nav.mousemove);
            },
            mouseclick:function(){
                var nav = GLFullScreen.nav;
                var event = arguments[0];
                if(event.button != nav.mouse_button) return;
                if(nav.mouseheld){
                    event.stopPropagation();
                    event.preventDefault();
                }
            },
            mousemove: function(){
                var nav = GLFullScreen.nav;
                var event = arguments[0];
                // nav.navStart = true;
                var nowPoint = {x:event.clientX,y:event.clientY};
                nav.navPanel.moveTo(event.screenX - nav.navPanelWidth/2,event.screenY - nav.navPanelWidth/2);
                nav.navTab(nowPoint);
            },
            turnOn:function(){
                window.addEventListener("mousedown",this.mousedown);
                window.addEventListener("mouseup", this.mouseup)
                window.addEventListener("click", this.mouseclick)
            },
            turnOff:function(){
                window.removeEventListener("mousedown",this.mousedown);
                window.removeEventListener("mouseup", this.mouseup, true)
                window.removeEventListener("click", this.mouseclick)
            }
        },
        init: function(){
            this.navigatorPanel = document.getElementById("fullscreen-navigator-panel");
            this.navigator = document.getElementById("navigator-toolbox");
            this.palette = gNavToolbox.palette.cloneNode(true);
            var triggerBottom = document.createElement("hbox");
            triggerBottom.id = "gl-trigger-bottom"
            triggerBottom.height = 1;
            triggerBottom.style.backgroudColor = 'red';
            triggerBottom.addEventListener("mouseover",function(event){
                GLFullScreen.position.left = 0;
                GLFullScreen.position.top = 0;
                var className = GLFullScreen.navigator.className;
                className = className.replace(/ *gl-navigator-(top|right|bottom|left)/g,'');
                className+= " gl-navigator-bottom";

                GLFullScreen.navigator.className = className;
                GLFullScreen.showNav(event.target,"before_start");
            })
            document.getElementById("browser-panel").appendChild(triggerBottom);
            this.navigatorPanel.addEventListener("popuphidden",function(){
                var className = GLFullScreen.navigator.className;
                className = className.replace(/ *gl-navigator-(top|right|bottom|left)/g,'');
                GLFullScreen.navigator.className = className;
            })
            this.nav.init();
            this.checkUpdate();
            function PrefListener(branch_name, callback) {
              // Keeping a reference to the observed preference branch or it will get
              // garbage collected.
              var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
              this._branch = prefService.getBranch(branch_name);
              this._branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
              this._callback = callback;
            }

            PrefListener.prototype.observe = function(subject, topic, data) {
              if (topic == 'nsPref:changed')
                this._callback(this._branch, data);
            };

            /**
             * @param {boolean=} trigger if true triggers the registered function
             *   on registration, that is, when this method is called.
             */
            PrefListener.prototype.register = function(trigger) {
              this._branch.addObserver('', this, false);
              if (trigger) {
                let that = this;
                this._branch.getChildList('', {}).
                  forEach(function (pref_leaf_name)
                    { that._callback(that._branch, pref_leaf_name); });
              }
            };

            PrefListener.prototype.unregister = function() {
              if (this._branch)
                this._branch.removeObserver('', this);
            };

            var myListener = new PrefListener(
              "extensions.fullscreen.",
              function(branch, name) {
                switch (name) {
                  case "on_fullscreen":
                    GLFullScreen.nav.on_fullscreen = branch.getBoolPref("on_fullscreen");
                    break;
                  case "mouse_button":
                    GLFullScreen.nav.mouse_button = branch.getIntPref("mouse_button");
                    break;
                }
              }
            );

            myListener.register(true);
        },
        showNav: function(anchor,position){
            document.getElementById("navigator-toolbox").style.marginTop = "0px";
            if(GLFullScreen.navigatorPanel.state == "closed"){
                GLFullScreen.navigatorPanel.openPopup(anchor,"",GLFullScreen.position.left, GLFullScreen.position.top);
            }
            
            GLFullScreen.inPanel = true;
            GLFullScreen.position = {left: 0, top: 0};
        },
        changeID: function(ele, preStr){
            ele.id = preStr+ele.id;
            var children = ele.children;
            for(var i = 0; i < children.length; i++){
                GLFullScreen.changeID(children[i]);
            }
        },
        maxmodeFlg: false,
        changeState: function(clickedItem){
            var items = document.getElementsByClassName("gl-full");
            for(var i = 0; i < items.length; i++){
                items[i].setAttribute("disabled", "false");
            }
            if(clickedItem){
                clickedItem.setAttribute("disabled", "true");
            }
        },
        fullscreen: function(event){
            GLFullScreen.maxmodeFlg = false;
            if(window.fullScreen){
                window.moveTo(0,0);
                window.resizeTo(screen.width,screen.height);
                event.target.setAttribute("disabled", "true");
            }else{
                window.fullScreen = true;
            }
            this.changeState(event.target);
            GLFullScreen.navigatorPanel.hidePopup();
            event.stopPropagation();
            event.preventDefault();
        },
        maxmodeFullscreen: function(event){
            GLFullScreen.maxmodeFlg = true;
            if(window.fullScreen){
                window.moveTo(screen.availLeft,screen.availTop);
                window.resizeTo(screen.availWidth,screen.availHeight);
                event.target.setAttribute("disabled", "true");
            }else{
                window.fullScreen = true;
            }
            this.changeState(event.target);
            GLFullScreen.navigatorPanel.hidePopup();
            event.stopPropagation();
            event.preventDefault();
        },
        checkUpdate: function(){
            var version = 999;
            try{
                var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
                var branch = prefService.getBranch("extensions.fullscreen.");
                version = branch.getIntPref("version");
            }
            catch(ex){}
            var newVersion = 100;
            try {
                // Firefox 4 and later; Mozilla 2 and later
                Components.utils.import("resource://gre/modules/AddonManager.jsm");
                AddonManager.getAddonByID("FullScreen@muha.com", function(addon) {
                    newVersion = parseInt(addon.version.replace(/\./g,''));
                    if(!version || version < newVersion){
                        GLFullScreen.showFeaturesPage();
                        branch.setIntPref("version",newVersion);
                    }
              });
            }
            catch (ex) {
                // Firefox 3.6 and before; Mozilla 1.9.2 and before
                var em = Components.classes["@mozilla.org/extensions/manager;1"]
                         .getService(Components.interfaces.nsIExtensionManager);
                var addon = em.getItemForID("FullScreen@muha.com");
                newVersion = parseInt(addon.version.replace(/\./g,''));
                if(!version || version < newVersion){
                    GLFullScreen.showFeaturesPage();
                    branch.setIntPref("version",newVersion);
                }
            }
        },
        showFeaturesPage: function(){
            window.openDialog("chrome://fullscreen/content/newFeatures.xul","features" ,"chrome,centerscreen,all" );
        }

    }
    window.addEventListener("load",function(){
        GLFullScreen.init();
        setTimeout(function(){
            if(document.getElementById("main-window").getAttribute("sizemode") == "fullscreen"){
                GLFullScreen.navigatorPanel.appendChild(GLFullScreen.navigator);
                document.getElementById("fullscr-toggler").setAttribute("collapsed", "false");
            }
            window.addEventListener("fullscreen", function(){
                if(!window.fullScreen){
                    GLFullScreen.navigatorPanel.width = window.screen.width;
                    GLFullScreen.navigatorPanel.appendChild(GLFullScreen.navigator);

                    if(GLFullScreen.maxmodeFlg){
                        setTimeout(function(){
                            GLFullScreen.navigatorPanel.width = screen.availWidth;
                            window.moveTo(screen.availLeft, screen.availTop) ;
                            window.resizeTo(screen.availWidth,screen.availHeight);
                        },200)
                    }else{
                        GLFullScreen.navigatorPanel.width = window.screen.width;
                    }
                    document.getElementById("fullscr-toggler").setAttribute("collapsed", "false");
                }else{
                    var fullscrtoggler = document.getElementById("fullscr-toggler");
                    document.getElementById("browser-panel").insertBefore(GLFullScreen.navigator, fullscrtoggler);
                    document.getElementById("fullscr-toggler").setAttribute("collapsed", "true");
                    GLFullScreen.changeState();
                    gNavToolbox.palette = GLFullScreen.palette;
                    GLFullScreen.navigatorPanel.hidePopup();
                }

            })
        },3000);
        document.getElementById("fullscr-toggler").addEventListener("mouseover",function(event){
            var className = GLFullScreen.navigator.className;
            className = className.replace(/ *gl-navigator-(top|right|bottom|left)/g,'');
            className+= " gl-navigator-top";
            GLFullScreen.navigator.className = className;
            GLFullScreen.left = screen.availLeft;
            GLFullScreen.top = event.clientY;
            GLFullScreen.showNav();
            event.stopPropagation();
            event.preventDefault();
        },true);
        document.getElementById("fullscr-toggler").addEventListener("mouseout",function(event){
            setTimeout(function(){
                document.getElementById("fullscr-toggler").setAttribute("collapsed", "false");
            },1);
        },true);
        GLFullScreen.navigatorPanel.addEventListener("mouseover",function(){
            GLFullScreen.inPanel = true;
            GLFullScreen.timer && clearTimeout(GLFullScreen.timer);
        })
        GLFullScreen.navigatorPanel.addEventListener("mouseout",function(){
            GLFullScreen.inPanel = false;
            GLFullScreen.timer = setTimeout(function(){
                if(!GLFullScreen.inPanel && !GLFullScreen.nav.navStart){
                    GLFullScreen.navigatorPanel.hidePopup();
                }
            },1000)
        })
        // window.addEventListener("keydown",function(event){
        //     if(GLFullScreen.maxmodeFlg){
        //         var mainWindow = document.getElementById("main-window");
        //         if(mainWindow.getAttribute("maxmodeFull")){
        //             var fullscrtoggler = document.getElementById("fullscr-toggler");
        //             document.getElementById("browser-panel").insertBefore(GLFullScreen.navigator, fullscrtoggler);
        //             mainWindow.setAttribute("maxmodeFull", "");
        //         }else{
        //             GLFullScreen.navigatorPanel.width = window.screen.width;
        //             GLFullScreen.navigatorPanel.appendChild(GLFullScreen.navigator);
        //             mainWindow.setAttribute("maxmodeFull", "true");
        //         }
        //         event.preventDefault();
        //     }
        // },true)
    });
}
// window.addEventListener("click",function(){
//     document.getElementById("navigator-toolbox").openPopup(null,"",0, 0);
// })
