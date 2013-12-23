Components.utils.import("resource://gre/modules/NetUtil.jsm");
function openSet(){
  window.openDialog("chrome://fullscreen/content/set.xul","set" ,"chrome,centerscreen,all,modal" );
  window.close();
}
window.addEventListener("load", function(){
  var ioService = Components.classes["@mozilla.org/network/io-service;1"]
                    .getService(Components.interfaces.nsIIOService);
  var uri = ioService.newURI("chrome://fullscreen/content/features.json","UTF-8",null);
  var channel = NetUtil.newChannel(uri);
  channel.contentType = "application/json";

  NetUtil.asyncFetch(channel, function(inputStream, status) {
      if (!Components.isSuccessCode(status)) {
          // Handle error!
          S.console.debug("Error getRule");
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
      console.debug("features:"+features[navigator.language]);
  });
})
