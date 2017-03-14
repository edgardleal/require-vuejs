/*globals: define, require */
/*
 * css-parser.js
 *
 * Distributed under terms of the MIT license.
 */

/* jshint ignore:start */

/* jshint ignore:end */

define("css-parser", [], function() {
    'use strict';
    var extractCss = function(text) {
        var start = text.indexOf("<style>");
        var end = text.indexOf("</style>");

        if( start === -1 ) {
            return false;
        } else {
            return text.substring(start + 7, end);
        }
    };

    var appendCSSStyle = function(css) {
        if(css === false) {
            return;
        } else {
            var style = document.createElement("style");
            var head = document.head || document.getElementsByTagName('head')[0];

            style.type = "text/css";
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
        }
    };
    
    return {
        extractCss: extractCss,
        appendCSSStyle: appendCSSStyle,

        parse: function(text) {
            var css = extractCss(text);
            appendCSSStyle(css);
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 noexpandtab : */
;
/*
 * template-parser.js
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */

/* jshint ignore:end */

define("template-parser", [], function(){
  'use strict';
  
    var extractTemplate = function(text) {
       var start = text.indexOf("<template>");
       var end   = text.indexOf("</template>");
       return text.substring(start + 10, end)
         .replace(/([^\\])'/g, "$1\\'")
         .replace(/[\n\r]+/g, "")
         .replace(/ {2,20}/g, " ");
    };


    return {
        extractTemplate: extractTemplate
    };
    
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
;
/*
 * vue.js
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */

/* jshint ignore:end */

define("vue", ["css-parser", "template-parser"], function(cssParser, templateParser) {
    return {
        load: function (name, req, onload, config) {
            var url, extension; 

            // if file name has an extension, don't add .vue
            if(/.*(\.vue)|(\.html?)/.test(name)) {
                extension = "";
            } else {
                extension = ".vue";
            }

            url = req.toUrl(name + extension);

            var sourceHeader = config.isBuild?"" : "//# sourceURL=" + location.origin + url + "\n";
            var functionTemplate = ["(function(template){", "})("];

            var extractScript = function(text) {
               var start = text.indexOf("<script>");
               var end = text.indexOf("</script>");
               return text.substring(start + 8, end);
            };
            
            var parse = function(text) {
               var template = templateParser.extractTemplate(text);
               var source = extractScript(text);
               if(!config.isBuild) {
                   cssParser.parse(text);
               } // TODO: Don't optimize css yet 

               return sourceHeader +
                  functionTemplate[0] +
                  source +
                  functionTemplate[1] +
                  "'" + template + "');";
            };

            var loadRemote;

            if(config.isBuild) {
                var fs = require('fs');
                loadRemote = function(url, callback) {
                    var text = fs.readFileSync().toString();
                    callback(parse(text));
                };

            } else {
                loadRemote = function(path, callback) {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                        if (this.readyState === 4 && (this.status === 200 || this.status === 304)) {
                            callback(parse(xhttp.responseText));
                        }
                    };
                    xhttp.open("GET", path, true);
                    xhttp.send();
                };
            }

            req([], function() {
                loadRemote(url, function(text){
                    onload.fromText(text);
                });
            });
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 noexpandtab : */
;
/*global define */

/* jshint ignore:start */

/* jshint ignore:end */

define("require-vuejs", ["vue"], function(vue){
    return vue;
});
/*vim: set ts=4 ex=4 tabshift=4 :*/
;
