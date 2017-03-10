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
               if(config.isBuild) {
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
