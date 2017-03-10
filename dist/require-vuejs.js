/*
 * css-parse.js
 *
 * Distributed under terms of the MIT license.
 */
if (typeof module === "object") {
    var define = require("requirejs").define;
}

define("_cssparser", [], function() {
    'use strict';
    const extractCss = function(text) {
        var start = text.indexOf("<style>");
        var end = text.indexOf("</style>");

        if( start === -1 ) {
            return false;
        } else {
            return text.substring(start + 7, end);
        }
    };

    const appendCSSStyle = function(css) {
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
            const css = extractCss(text);
            appendCSSStyle(css);
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 noexpandtab : */
;
/*
 * vue.js
 *
 * Distributed under terms of the MIT license.
 */
define("vue", ["_cssparser"], function(cssParser) {
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

            var functionTemplate = ["(function(template){",
              "})("];

            var extractTemplate = function(text) {
               var start = text.indexOf("<template>");
               var end   = text.indexOf("</template>");
               return text.substring(start + 10, end)
                 .replace(/([^\\])'/g, "$1\\'")
                 .replace(/[\n\r]+/g, "");
            };

            var extractScript = function(text) {
               var start = text.indexOf("<script>");
               var end = text.indexOf("</script>");
               return text.substring(start + 8, end);
            };
            
            var parse = function(text) {
               var template = extractTemplate(text);
               var source = extractScript(text);
               if(!config.isBuild) {
                   cssParser.parse(text);
               } // TODO: Don't optimize css yet 

               return functionTemplate[0] +
                  source +
                  functionTemplate[1] +
                  "'" + template + "');";
            };

            var loadRemote;

            if(config.isBuild) {
                var fs = require('fs');
                loadRemote = function(url, callback) {
                    var text = js.readFileSync().toString();
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
/*global define, require, module, XMLHttpRequest, document */
define("require-vuejs", ["vue"], function(vue){
    return vue;
});
/*vim: set ts=4 ex=4 tabshift=4 :*/
;
