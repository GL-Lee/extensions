if(typeof GLFullScreen == "undefined"){
    var GLFullScreen={
        navigatorPanel: null,
        navigator: null,
        position:{left:0,top:0},
        menuToggleFlg: "true",
        nav:{
            navStart: false,
            pixH:150,
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
                if(event.button != nav.mouse_button ){
                    if(!GLFullScreen.inPanel)
                        GLFullScreen.navigatorPanel.style.display = "none";
                    return;
                }
                nav.startPosition.x = event.clientX;
                nav.startPosition.y = event.clientY;
                nav.mousedowned = true;
                if(event.button == nav.mouse_button && !window.getBrowserSelection()){
                    setTimeout(function(){
                        if(nav.mousedowned){
                            if(window.fullScreen){
                                GLFullScreen.showNav("top");                    
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
                    if(nav.moved){
                        GLFullScreen.navigatorPanel.style.display = "none";
                    }else{
                        setTimeout(function(){
                            if(!GLFullScreen.inPanel)
                                GLFullScreen.navigatorPanel.style.display = "none";
                        }, 4000)
                    }
                    
                }
                setTimeout(function(){
                    nav.navPanel.className="";
                    nav.navPanel.hidePopup();
                    nav.mouseheld = false;
                },10)
                window.removeEventListener("mousemove", nav.mousemove);
                nav.moved = false;
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
                nav.moved = true;
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
        toolbarSet:{
            menubar: false,
            navbar: false,
            bookmarbar: false,
            addonbar: false,
            menubar_bak: false,
            navbar_bak: false,
            bookmarbar_bak: false,
            addonbar_bak: false,
            init:function(){
                var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
                var branch = prefService.getBranch("extensions.fullscreen.");
                this.menubar = branch.getBoolPref("menubar");
                this.navbar = branch.getBoolPref("navbar");
                this.bookmarbar = branch.getBoolPref("bookmarbar");
                this.addonbar = branch.getBoolPref("addonbar");
                
                this.menubar_bak = document.getElementById("toolbar-menubar").getAttribute("moz-collapsed");
                this.menubar_bak === undefined? false: this.menubar_bak;

                this.navbar_bak = document.getElementById("nav-bar").getAttribute("moz-collapsed");
                this.navbar_bak === undefined? false: this.navbar_bak;

                this.bookmarbar_bak = document.getElementById("PersonalToolbar").getAttribute("moz-collapsed");
                this.bookmarbar_bak === undefined? false: this.bookmarbar_bak;

                this.addonbar_bak = document.getElementById("addon-bar").getAttribute("moz-collapsed");
                this.addonbar_bak === undefined? false: this.addonbar_bak;

                setTimeout(function(){GLFullScreen.toolbarSet.set.call(GLFullScreen.toolbarSet)}, 3000);
            },
            set: function(){
                if(!window.fullScreen) return;
                document.getElementById("toolbar-menubar").setAttribute("moz-collapsed", !this.menubar);
                document.getElementById("nav-bar").setAttribute("moz-collapsed", !this.navbar);
                document.getElementById("PersonalToolbar").setAttribute("moz-collapsed", !this.bookmarbar);
                document.getElementById("addon-bar").setAttribute("moz-collapsed", !this.addonbar);
                if(this.menubar){
                    var menubar = document.getElementById("toolbar-menubar");
                    var hbox = document.createElement("hbox");
                    hbox.className = "gl-hbox-flex";
                    hbox.setAttribute("flex", 1);
                    menubar.appendChild(hbox);
                    menubar.appendChild(document.getElementById("window-controls"));
                }
                if(!this.navbar){
                    document.getElementById("tabbrowser-tabs").appendChild(document.getElementById("gl-fullscreen-switch-button"));
                }else{
                    document.getElementById("nav-bar").appendChild(document.getElementById("gl-fullscreen-switch-button"));
                }
            },
            unset: function(){
                var menubar = document.getElementById("toolbar-menubar");
                if(this.menubar){
                    menubar.removeChild(document.querySelector("#toolbar-menubar .gl-hbox-flex"));
                    document.getElementById("TabsToolbar").appendChild(document.getElementById("window-controls"))
                }
                document.getElementById("toolbar-menubar").setAttribute("moz-collapsed", this.menubar_bak);
                document.getElementById("nav-bar").setAttribute("moz-collapsed", this.navbar_bak);
                document.getElementById("PersonalToolbar").setAttribute("moz-collapsed", this.bookmarbar_bak);
                document.getElementById("addon-bar").setAttribute("moz-collapsed", this.addonbar_bak);
                if(!this.navbar){
                    document.getElementById("nav-bar").appendChild(document.getElementById("gl-fullscreen-switch-button"));
                }
            }
        },
        init: function(){
            this.navigatorPanel = document.getElementById("fullscreen-navigator-panel");
            this.navigator = document.getElementById("navigator-toolbox");
            this.palette = gNavToolbox.palette.cloneNode(true);
            var triggerBottom = this.triggerBottom = document.createElement("hbox");
            triggerBottom.id = "gl-trigger-bottom"
            triggerBottom.height = 1;
            triggerBottom.collapsed = true;
            triggerBottom.style.backgroudColor = 'red';
            triggerBottom.addEventListener("mouseover",function(event){
                GLFullScreen.position.left = 0;
                GLFullScreen.position.top = 0;
                var className = GLFullScreen.navigator.className;
                className = className.replace(/ *gl-navigator-(top|right|bottom|left)/g,'');
                className+= " gl-navigator-bottom";

                GLFullScreen.navigator.className = className;
                console.log(event.screenY + ":" + window.getComputedStyle(GLFullScreen.navigatorPanel , null)['height'])
                GLFullScreen.showNav("bottom");
            })
            document.getElementById("browser-panel").appendChild(triggerBottom);
            this.navigatorPanel.addEventListener("popuphidden",function(){
                var className = GLFullScreen.navigator.className;
                className = className.replace(/ *gl-navigator-(top|right|bottom|left)/g,'');
                GLFullScreen.navigator.className = className;
            })
            var toggler = this.toggler = document.createElement("hbox");
            toggler.id = "gl-fullscr-toggler";
            document.getElementById("browser-panel").insertBefore(toggler, document.getElementById("browser"));

            var prefService = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService);
            var branch = prefService.getBranch("extensions.fullscreen.");
            this.bottomTrigger = branch.getBoolPref("bottom_trigger");

            this.nav.init();
            this.toolbarSet.init();
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
                  case "menubar":
                    GLFullScreen.toolbarSet.menubar = branch.getBoolPref("menubar");
                    break;
                  case "navbar":
                    GLFullScreen.toolbarSet.navbar = branch.getBoolPref("navbar");
                    break;
                  case "bookmarbar":
                    GLFullScreen.toolbarSet.bookmarbar = branch.getBoolPref("bookmarbar");
                    break;
                  case "addonbar":
                    GLFullScreen.toolbarSet.addonbar = branch.getBoolPref("addonbar");
                    break;
                  case "bottom_trigger":
                    GLFullScreen.bottomTrigger = branch.getBoolPref("bottom_trigger");
                    GLFullScreen.triggerBottom.collapsed = !GLFullScreen.bottomTrigger || false;
                    break;
                }
                GLFullScreen.toolbarSet.set();
              }
            );

            myListener.register(true);
        },
        showNav: function(trigger_position){
            document.getElementById("navigator-toolbox").style.marginTop = "0px";
            // if(GLFullScreen.navigatorPanel.state == "closed"){
                // GLFullScreen.navigatorPanel.openPopup(anchor,"",GLFullScreen.position.left, GLFullScreen.position.top);
                GLFullScreen.navigatorPanel.style.display = "block";
                if(trigger_position == "bottom"){
                    GLFullScreen.navigatorPanel.style.top = "auto";
                    GLFullScreen.navigatorPanel.style.bottom = 0;
                }else{
                    GLFullScreen.navigatorPanel.style.top = 0;
                    GLFullScreen.navigatorPanel.style.bottom = "auto";
                }
                // GLFullScreen.navigatorPanel.style.position = "fixed";
            // }
            
            // GLFullScreen.inPanel = true;
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
            if(window.fullScreen){
                window.moveTo(0,0);
                window.resizeTo(screen.width,screen.height);
                event.target.setAttribute("disabled", "true");
            }else{
                window.fullScreen = true;
            }
            this.changeState(event.target);
            GLFullScreen.navigatorPanel.style.display = "none";
            event.stopPropagation();
            event.preventDefault();
            GLFullScreen.maxmodeFlg = false;
        },
        maxmodeFullscreen: function(event){
            if(window.fullScreen){
                window.moveTo(screen.availLeft,screen.availTop);
                window.resizeTo(screen.availWidth,screen.availHeight);
                event.target.setAttribute("disabled", "true");
            }else{
                window.fullScreen = true;
            }
            this.changeState(event.target);
            GLFullScreen.navigatorPanel.style.display = "none";

            event.stopPropagation();
            event.preventDefault();
            GLFullScreen.maxmodeFlg = true;
        },
        checkUpdate: function(){
            var version = 124;
            var configVersion = 999;
            try{
                var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
                var branch = prefService.getBranch("extensions.fullscreen.");
                configVersion = branch.getIntPref("version");
            }
            catch(ex){}
            if(version > configVersion){
                GLFullScreen.showFeaturesPage();
            }
            var newVersion = 100;
            try {
                // Firefox 4 and later; Mozilla 2 and later
                Components.utils.import("resource://gre/modules/AddonManager.jsm");
                AddonManager.getAddonByID("FullScreen@muha.com", function(addon) {
                    newVersion = parseInt(addon.version.replace(/\./g,''));
                    branch.setIntPref("version",newVersion);
              });
            }
            catch (ex) {
                // Firefox 3.6 and before; Mozilla 1.9.2 and before
                var em = Components.classes["@mozilla.org/extensions/manager;1"]
                         .getService(Components.interfaces.nsIExtensionManager);
                var addon = em.getItemForID("FullScreen@muha.com");
                newVersion = parseInt(addon.version.replace(/\./g,''));
                branch.setIntPref("version",newVersion);
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
                GLFullScreen.triggerBottom.collapsed = !GLFullScreen.bottomTrigger || false;
            }
            window.addEventListener("fullscreen", function(){
                if(!window.fullScreen){
                    GLFullScreen.menuToggleFlg = document.getElementById("toolbar-menubar").getAttribute("autohide");
                    setToolbarVisibility(document.getElementById("toolbar-menubar"), true);
                    // GLFullScreen.navigatorPanel.width = window.screen.width;
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
                    // GLFullScreen.toggler.setAttribute("collapsed", "false");
                    GLFullScreen.triggerBottom.collapsed = !GLFullScreen.bottomTrigger || false;
                    setTimeout(function(){GLFullScreen.toolbarSet.set.call(GLFullScreen.toolbarSet)}, 300);
                }else{
                    setTimeout(function(){
                        if(GLFullScreen.menuToggleFlg == "true"){
                            setToolbarVisibility(document.getElementById("toolbar-menubar"), false);
                       }
                    },100)
                    var fullscrtoggler = document.getElementById("fullscr-toggler");
                    document.getElementById("browser-panel").insertBefore(GLFullScreen.navigator, fullscrtoggler);
                    gNavToolbox.palette = GLFullScreen.palette;
                    // GLFullScreen.toggler.setAttribute("collapsed", "true");
                    GLFullScreen.changeState();
                    GLFullScreen.navigatorPanel.style.display = "none";;
                    GLFullScreen.triggerBottom.collapsed = true;
                    GLFullScreen.toolbarSet.unset();
                }

            })
        },3000);
        GLFullScreen.toggler.addEventListener("mouseover",function(event){
            var className = GLFullScreen.navigator.className;
            className = className.replace(/ *gl-navigator-(top|right|bottom|left)/g,'');
            className+= " gl-navigator-top";
            GLFullScreen.navigator.className = className;
            GLFullScreen.left = screen.availLeft;
            GLFullScreen.top = event.clientY;
            GLFullScreen.showNav("top");
            event.stopPropagation();
            event.preventDefault();
        },false);
        // GLFullScreen.toggler.addEventListener("mouseout",function(event){
        //     setTimeout(function(){
        //         document.getElementById("fullscr-toggler").setAttribute("collapsed", "false");
        //     },1);
        // },true);
        GLFullScreen.navigatorPanel.addEventListener("mouseover",function(){
            GLFullScreen.inPanel = true;
            GLFullScreen.timer && clearTimeout(GLFullScreen.timer);
        })
        GLFullScreen.navigatorPanel.addEventListener("mouseout",function(){
            GLFullScreen.inPanel = false;
            GLFullScreen.timer = setTimeout(function(){
                if(!GLFullScreen.inPanel && !GLFullScreen.nav.navStart){
                    GLFullScreen.navigatorPanel.style.display = "none";;
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
