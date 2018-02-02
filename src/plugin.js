/*
 * vue.js
 *
 * Distributed under terms of the MIT license.
 */
/* global Promise */
/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
/* jshint ignore:end */

define("plugin", ["css_parser", "template_parser", "script_parser"], function(css_parser, template_parser, script_parser) {
    "use strict";

    var modulesLoaded = {};

    var functionTemplate = ["(function(template){", "})("];

    var parse = function(text) {
        var template = template_parser.extractTemplate(text);
        var source = script_parser.extractScript(text);
        var functionString = css_parser.functionString(text);
 
        return functionTemplate[0] +
         source +
          functionString +
          functionTemplate[1] +
          template + ");";
    };

    var loadLocal = function(url, name) {
        var fs = require.nodeRequire("fs");
        var text = fs.readFileSync(url, "utf-8");
        if(text[0] === "\uFEFF") { // remove BOM ( Byte Mark Order ) from utf8 files 
            text = text.substring(1);
        }
        var parsed = parse(text).replace(/(define\()\s*(\[.*)/, "$1\"vue!" + name + "\", $2");
        return parsed;
    };

    return {
        normalize: function(name, normalize) {
            return normalize(name);
        },
        write: function(pluginName, moduleName, write) {
            write.asModule(pluginName + "!" + moduleName, modulesLoaded[moduleName]);
        },
        load: function (name, req, onload, config) {
            var url, extension; 

            if (config.paths && config.paths[name]) {
                name = config.paths[name];
            }

            // if file name has an extension, don't add .vue
            if(/.*(\.vue)|(\.html?)/.test(name)) {
                extension = "";
            } else {
                extension = ".vue";
            }

            url = req.toUrl(name + extension);

            // this is used to browser to create a way to debug the file 
            var sourceHeader = config.isBuild?"" : "//# sourceURL=" + location.origin + url + "\n";
            var loadRemote;

            if(config.isBuild) {
                loadRemote = function(url, callback) {
                    return new Promise(function(resolve, reject) {
                        try {
                            var fs = require.nodeRequire("fs");
                            var text = fs.readFileSync(url, "utf-8").toString();
                            if(text[0] === "\uFEFF") { // remove BOM ( Byte Mark Order ) from utf8 files 
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
                        if (xhttp.readyState === 4 && (xhttp.status === 200 || xhttp.status === 304)) {
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
                        onload.fromText(modulesLoaded[name]);
                    });
                }
            });
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
