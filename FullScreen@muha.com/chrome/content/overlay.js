if(typeof GLFullScreen == "undefined"){
    var GLFullScreen={
        navigatorPanel: null,
        navigator: null,
        init: function(){
            this.navigatorPanel = document.getElementById("fullscreen-navigator-panel");
            this.navigator = document.getElementById("navigator-toolbox");
        },
        showNav: function(){
            document.getElementById("fullscreen-navigator-panel").openPopup(null,"",0, 0);
        },
        changeID: function(ele, preStr){
            ele.id = preStr+ele.id;
            var children = ele.children;
            for(var i = 0; i < children.length; i++){
                GLFullScreen.changeID(children[i]);
            }
        },
        maxmodeFlg: false,
        fullscreen: function(event){
            GLFullScreen.maxmodeFlg = false;
            window.fullScreen = !window.fullScreen;
            event.stopPropagation();
            event.preventDefault();
        },
        maxmodeFullscreen: function(event){
            GLFullScreen.maxmodeFlg = true;
            window.fullScreen = !window.fullScreen;
            event.stopPropagation();
            event.preventDefault();
        }
    }
    window.addEventListener("load",function(){
        GLFullScreen.init();
        setTimeout(function(){
            if(document.getElementById("main-window").getAttribute("sizemode") == "fullscreen"){
                GLFullScreen.navigatorPanel.width = window.screen.width;
                GLFullScreen.navigatorPanel.appendChild(GLFullScreen.navigator);
            }
            window.addEventListener("fullscreen", function(){
                if(!window.fullScreen){
                    GLFullScreen.navigatorPanel.width = window.screen.width;
                    GLFullScreen.navigatorPanel.appendChild(GLFullScreen.navigator);

                    if(GLFullScreen.maxmodeFlg){
                        setTimeout(function(){
                            window.moveTo(0,0) ;
                            window.resizeTo(screen.availWidth,screen.availHeight);
                        },100)
                    }
                }else{
                    var fullscrtoggler = document.getElementById("fullscr-toggler");
                    document.getElementById("browser-panel").insertBefore(GLFullScreen.navigator, fullscrtoggler);
                }
            })
        },2000);
        document.getElementById("fullscr-toggler").addEventListener("mouseover",function(event){
            GLFullScreen.showNav();
            setTimeout(function(){
                document.getElementById("fullscr-toggler").setAttribute("collapsed", "false");
            },1);
            event.stopPropagation();
            event.preventDefault();
        },true);
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
