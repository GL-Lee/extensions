if(typeof GLFullScreen == "undefined"){
    var GLFullScreen={
        navigatorPanel: null,
        navigator: null,
        position:{left:0,top:0},
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
        },
        showNav: function(anchor,position){
            document.getElementById("navigator-toolbox").style.marginTop = "0px";
            GLFullScreen.navigatorPanel.openPopup(anchor,"",GLFullScreen.position.left, GLFullScreen.position.top);
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
                if(!GLFullScreen.inPanel){
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
