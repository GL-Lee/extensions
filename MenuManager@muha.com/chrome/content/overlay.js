if(typeof GL_MenuManager == "undefined"){
    var GL_MenuManager = {
        init:function(){
            this.view.init();
            this.model.init();
        },
        view:{
            menuIds:["tabContextMenu","contentAreaContextMenu"],
            menus:[],
            currentMenu:{},
            init:function(){
                var menuIds = this.menuIds;
                var menus = this.menus;
                for(var i = 0; i < menuIds.length; i++){
                    var menu = document.getElementById(menuIds[i]);
                    var index = 0;
                    for(var j = 0; j< menu.children.length; j++){
                        menu.children[j].glIndex = index++;
                    }
                    menus.push(menu);
                }
                this.addPullArrow();
                this.bindEvents();
                Components.utils.import("resource://gre/modules/NetUtil.jsm");
            },
            addPullArrow: function(){
                var menus = this.menus;
                var _this = this;
                for(var i = 0; i < menus.length; i++){
                    var separator = document.createElement("menuseparator");
                    menus[i].appendChild(separator);

                    var item = document.createElement("hbox");
                    item.targetMenu = menus[i];

                    console.log("manager:"+item.targetMenu.id);
                    var spacer = document.createElement("spacer");
                    spacer.setAttribute("flex", "1");
                    item.appendChild(spacer);

                    var arrow = document.createElement("image");
                    arrow.setAttribute("src", "chrome://menumanager/content/image/down-arrow.png");
                    arrow.addEventListener("click", this.show);
                    arrow.addEventListener("click", function(event){
                        _this.show();
                        var container = event.target.parentNode.targetMenu.hiddenContainer;
                        container.hidden = !container.hidden;
                    })
                    item.appendChild(arrow);

                    spacer = spacer.cloneNode();
                    item.appendChild(spacer);

                    var edit = document.createElement("image");
                    edit.setAttribute("src", "chrome://menumanager/content/image/edit.png");
                    edit.addEventListener("click", function(){
                        _this.edit();
                    })
                    item.appendChild(edit);

                    var containerWrap = document.createElement("vbox");
                    containerWrap.appendChild(item);

                    var container = document.createElement("vbox");
                    container.hidden = true;
                    containerWrap.appendChild(container);

                    menus[i].appendChild(containerWrap);
                    menus[i].hiddenContainer = container;
                }
            },
            edit: function(){
                var items = this.currentMenu.children;
                for(var i = 0; i < items.length; i++){
                    if(items[i].tagName != "menuseparator"){
                        
                    }
                }
            },
            show: function(){

            },
            bindEvents: function(){
                this.bindDrag();
            },
            bindDrag: function(){
                var menus = document.querySelectorAll("menupopup");
                for(var i =0; i < menus.length; i++){
                    menus[i].addEventListener("dragstart", function(event){
                        event.dataTransfer.setData('text/plain', 'This text may be dragged');
                    })
                    menus[i].addEventListener("dragend", function(event){
                        GL_MenuManager.view.drag(event.target, event.currentTarget);
                    })
                }
            },
            drag: function(dragedItem, menu){
                var nextSibling = dragedItem.boxObject.nextSibling;
                var previousSibling = dragedItem.boxObject.previousSibling;
                if(dragedItem.glhidden){
                    var nextEle = dragedItem.nextEle;
                    while(nextEle && nextEle.glhidden){
                        nextEle = nextEle.nextEle;
                    }
                    menu.insertBefore(dragedItem, nextEle);
                    dragedItem.glhidden = false;
                    if(nextSibling && nextSibling.tagName == "menuseparator" && (!previousSibling || previousSibling.tagName == "hbox" || previousSibling.tagName == "menuseparator")){
                        GL_MenuManager.view.drag(nextSibling, menu);
                    }
                }else{
                    dragedItem.nextEle = dragedItem.nextSibling;
                    var aitem = null;
                    var hitems = menu.hiddenContainer.children;
                    // alert(dragedItem.glIndex)
                    for(var i = 0; i< hitems.length; i++ ){
                        // alert(aitem.glIndex)
                        if(hitems[i].glIndex > dragedItem.glIndex){
                            aitem = hitems[i];
                            break;
                        }
                    }
                    if(aitem){
                        menu.hiddenContainer.insertBefore(dragedItem, aitem);
                    }else{
                        menu.hiddenContainer.appendChild(dragedItem);
                    }
                    dragedItem.glhidden = true;
                    if(!previousSibling && nextSibling.tagName == "menuseparator"){
                        GL_MenuManager.view.drag(nextSibling, menu);
                    }
                }
            },
            moveItem: function(){

            },
            moveToHidden: function(){

            },
            bind: function(eventType, fun){

            }
        },
        model:{
            init: function(){

            }
        },
        extendElement: function(){

        },
        getStore: function(){
            var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
            var uri = ioService.newURI("chrome://menumanager/content/store.json","UTF-8",null);
            var channel = NetUtil.newChannel(uri);
            channel.contentType = "application/json";

            NetUtil.asyncFetch(channel, function(inputStream, status) {
                if (!Components.isSuccessCode(status)) {
                    // Handle error!
                    return;
                }
                var data = NetUtil.readInputStreamToString(inputStream, inputStream.available(),{charset:"UTF-8"});//You can call nsIInputStream.available() to get the number of bytes currently available
                var lan = navigator.language;
                var features = JSON.parse(data)[lan].features;
                var wrapper = document.getElementById("wrapper");
                for(var i = 0; i < features.length; i++){
                    var label = document.createElement("label");
                    label.className = "version";
                    label.setAttribute("value", "version-"+features[i].version);
                    descText = document.createTextNode(features[i].desc)
                    var desc = document.createElement("description");
                    desc.className = "features";
                    desc.appendChild(descText);
                    wrapper.appendChild(label);
                    wrapper.appendChild(desc);
                }
            });
        },
        store: function(){
            // var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
            // var uri = ioService.newURI("chrome://menumanager/content/store.json","UTF-8",null);
            var menus = this.view.menus;
            var store = {};
            for(var i = 0; i< menus.length; i++){
                var children = menus[i].hiddenContainer.children;
                var s = store[menus[i].id]=[];
                for(j = 0; j < children.length; j++){
                    if(children[j].tagName != "menuseparator"){
                        s.push(children[j].id);
                    }
                }
            }

            var file = Cc["@mozilla.org/file/directory_service;1"].
                       getService(Ci.nsIProperties).
                       get("ProfD", Ci.nsIFile);
            file.append("glmenumanager.json");
            file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, 0666);

            // Then, we need an output stream to our output file.
            var ostream = Cc["@mozilla.org/network/file-output-stream;1"].
                          createInstance(Ci.nsIFileOutputStream);
            ostream.init(file, -1, -1, 0);

            // Finally, we need an input stream to take data from.
            var storeText = JSON.stringify(store);
            let istream = Cc["@mozilla.org/io/string-input-stream;1"].
                          createInstance(Ci.nsIStringInputStream);

            istream.setData(storeText, storeText.length);

            NetUtil.asyncCopy(istream, ostream, function(aResult) {
              if (!Components.isSuccessCode(aResult)) {
                // an error occurred!
              }
            })
        }
    }
    window.addEventListener("load", GL_MenuManager.init());
    window.addEventListener("unload", GL_MenuManager.store());
}
