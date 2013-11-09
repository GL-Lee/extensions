if ( !util ) var util = {};

(function(util, undefined){
    Components.utils.import("resource://gre/modules/Services.jsm");
    util.extend = function(original, extended, overwrite, keys){
        if ( !original || !extended ) return original;
        if ( overwrite === undefined ) overwrite = true;
        var i,p,l;
        if ( keys && (l=keys.length) ) {
            for ( i=0; i<l; i++ ) {
                p = keys[i];
                if ( (p in extended) && (overwrite || !(p in original)) ) {
                    original[p] = extended[p];
                }
            }
        } else {
            for (p in extended) {
                if ( overwrite || !(p in original) ) {
                    original[p] = extended[p];
                }
            }
        }
        return original;
    };
    util.fromUnicode = function (unicodeStr) {
        if (unicodeStr==null||unicodeStr.length==0) {
            return;
        }
        return(unescape(unicodeStr.replace(/\\u/g,'%u')));
    }
    util.toUnicode = function (str) {
        if (str==null||str.length==0) {
            return;
        }
        var strUnicode=str.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"&#x$2;")});
        strUnicode=strUnicode.replace(/;/g,'');
        strUnicode=strUnicode.replace(/&#x/g,'\\u');
        return strUnicode;
    }
    util.urlReg = /^(((ht|f)tp(s?))\:\/\/)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|cn|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk)(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*$/;
    util.isUrl = function(str){
        return util.urlReg.test(str);
    }
    util.trim = function( str){
        return ( str || '' ).replace( /^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
    };
    util.getClipboardData = function(){
        var Ci = Components.interfaces;
        const nsSupportsString = Components.Constructor("@mozilla.org/supports-string;1", "nsISupportsString");
        function SupportsString(str) {
            // Create an instance of the supports-string class
            var res = nsSupportsString();

            // Store the JavaScript string that we want to wrap in the new nsISupportsString object
            res.data = str;
            return res;
        }

        // Create a constructor for the built-in transferable class
        const nsTransferable = Components.Constructor("@mozilla.org/widget/transferable;1", "nsITransferable");

        // Create a wrapper to construct a nsITransferable instance and set its source to the given window, when necessary
        function Transferable(source) {
            var res = nsTransferable();
            if ('init' in res) {
                // When passed a Window object, find a suitable privacy context for it.
                if (source instanceof Ci.nsIDOMWindow)
                    // Note: in Gecko versions >16, you can import the PrivateBrowsingUtils.jsm module
                    // and use PrivateBrowsingUtils.privacyContextFromWindow(sourceWindow) instead
                    source = source.QueryInterface(Ci.nsIInterfaceRequestor)
                                   .getInterface(Ci.nsIWebNavigation);

                res.init(source);
            }
            return res;
        }
        var trans = Transferable();
        trans.addDataFlavor("text/unicode");
        Services.clipboard.getData(trans, Services.clipboard.kGlobalClipboard);
        var str       = {};
        var strLength = {};
        trans.getTransferData("text/unicode", str, strLength);
        var pastetext = "";
        if (str) {
          var pastetext = str.value.QueryInterface(Ci.nsISupportsString).data;
        }
        window.alert(pastetext)
        return pastetext;
    }
})(util);

var EXPORTED_SYMBOLS = ["util"];
