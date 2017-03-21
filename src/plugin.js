/*
 * vue.js
 *
 * Distributed under terms of the MIT license.
 */

/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
/* jshint ignore:end */

define(["css_parser", "template_parser", "script_parser"], function(css_parser, template_parser, script_parser) {

    var modulesLoaded = {};

    var functionTemplate = ["(function(template){", "})("];

    var parse = function(text) {
       var template = template_parser.extractTemplate(text);
       var source = script_parser.extractScript(text);
       if(typeof document !== "undefined") {
           css_parser.parse(text);
       }

       return functionTemplate[0] +
          source +
          functionTemplate[1] +
          "'" + template + "');";
    };

    var loadLocal = function(url, name) {
        var fs = require.nodeRequire("fs");
        var text = fs.readFileSync(url, "utf-8");
        if(text[0] === '\uFEFF') { // remove BOM ( Byte Mark Order ) from utf8 files 
            text = text.substring(1);
        }
        var parsed = parse(text).replace(/(define\()\s*(\[.*)/, "$1\"vue!" + name + "\", $2");
        return parsed;
    };

    return {
        write: function(pluginName, moduleName, write) {
            write.asModule(pluginName + "!" + moduleName, modulesLoaded[moduleName]);
        },
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
            var loadRemote;

            if(config.isBuild) {
                loadRemote = function(url, callback) {
                    return new Promise(function(resolve, reject) {
                        try {
                            var fs = require.nodeRequire("fs");
                            var text = fs.readFileSync(url, "utf-8").toString();
                            if(text[0] === '\uFEFF') { // remove BOM ( Byte Mark Order ) from utf8 files 
                                text = text.substring(1);
                            }
                            var parsed = parse(text).replace(/(define\()\s*(\[.*)/, "$1\"" + name + "\", $2");
                            callback(parsed);
                            resolve(parsed);
                        } catch(error) {
                            reject(error);
                        }
                    });
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
                if(config.isBuild) {
                    var data = loadLocal(url, name);
                    modulesLoaded[name] = data;
                    onload.fromText(data);
                } else {
                    loadRemote(url, function(text){
                        modulesLoaded[name] = sourceHeader + text;
                        onload.fromText(text);
                    });
                }
            });
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
