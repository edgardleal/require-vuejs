/*
 * vue.js
 *
 * Distributed under terms of the MIT license.
 */
var dependencies = ["css-parser", "template-parser", "script-parser"];
/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
    dependencies[0] = __dirnname + "/" + dependencies[0];
    dependencies[1] = __dirnname + "/" + dependencies[1];
}
/* jshint ignore:end */

define("plugin", dependencies, function(cssParser, templateParser, scriptParser) {
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

            var parse = function(text) {
               var template = templateParser.extractTemplate(text);
               var source = scriptParser.extractScript(text);
               if(!config.isBuild) {
                   cssParser.parse(text);
               }

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
                    var text = fs.readFileSync(url).toString();
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
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
