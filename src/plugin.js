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

define("plugin", ["css_parser", "template_parser", "template_preprocessor", "style_import"], function (css_parser, template_parser, template_preprocessor, style_import) {
    "use strict";

    var modulesLoaded = {};

    var functionTemplate = ["(function(template){", "})("];

    var parse = function(text) {
        var doc = document.implementation.createHTMLDocument("");
        //doc.body.innerHTML = text;
        /* 单标记、驼峰命名属性等预处理，石永琳，2021-6-15 */
        doc.body.innerHTML = template_preprocessor.handle(text);  //text;
        var scriptElement = doc.getElementsByTagName("script")[0];
        var source = scriptElement.innerHTML;
        var css_result = css_parser.parseElement(doc);
        var template = template_parser.extractTemplate(doc, css_result);
        var functionString = css_result.functionString;
        if (!source || source.length < 10) {
            source = scriptElement.src;
            source = "define(['" + source + "'], function(comp) {\n comp.template = template;\n return comp;\n});\n";
        }
 
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
        /**
         * 暴露 sfc 解析函数, 2023-1-16
         *
        ==================================================================================*/
        parseSfc: parse,
        helper: {
            preprocessor: template_preprocessor,
            css_parser,
            template_parser,
            style_import
        },
        /*=================================================================================*/
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

            // 增加对 razor page 的处理，2021-6-29
            if (/.*(\.cs)/.test(name)) {
                name = name.substring(0, name.length - 3);
                extension = "";
            } else
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
                    callback = callback || function() {};
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
                    callback = callback || function() {};
                    return new Promise(function(resolve, reject) {
                        var xhttp = new XMLHttpRequest();
                        xhttp.timeout = (
                            (config.waitSeconds || config.timeout) || 3
                        ) * 1000;
                        xhttp.onreadystatechange = function() {
                            //if (xhttp.readyState === 4
                            //    && xhttp.status < 400) {
                            //    var result = parse(xhttp.responseText);
                            //    callback(result);
                            //    resolve(result);
                            //}
                            if (xhttp.readyState === 4) {
                                if (xhttp.status < 400) {
                                    style_import.loadAndMerge(path, xhttp.responseText, req)
                                        .then(merged => {
                                            var result = parse(merged);
                                            callback(result);
                                            resolve(result);
                                        })
                                }
                                else {
                                    reject(xhttp.status)
                                    throw "No response available for request:" + path + ", status code: " + xhttp.status
                                }
                            }
                        };
                        xhttp.onerror = function (e) {
                            reject(e)
                            throw "Error loading: " + path;
                        }
                        xhttp.ontimeout = function() {
                            var error = new Error("Timeout loading: " + path);
                            callback({}, error);
                            reject(error);
                            throw error;
                        };
                        xhttp.open("GET", path, true);
                        xhttp.send();
                    });
                };
            }

            req([], function() {
                if(config.isBuild) {
                    var data = loadLocal(url, name);
                    modulesLoaded[name] = data;
                    onload.fromText(data);
                } else {
                    loadRemote(url)
                        .then(function(text, error){
                            if (error) {
                                onload.error(error);
                                throw new Error("Error loading: " + url);
                            }
                            modulesLoaded[name] = sourceHeader + text;
                            onload.fromText(modulesLoaded[name]);
                        })
                        .catch(function(error) {
                            var message = error ? error.message || "Error: " : "Error !";
                            message += "\n Url: " + url;
                            throw new Error(message);
                        });
                }
            });
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
