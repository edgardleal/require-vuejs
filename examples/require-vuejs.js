(function() {
/* jshint ignore:start */

/* jshint ignore:end */

define("require_vuejs", function(){
    return plugin;
});
/*vim: set ts=4 ex=4 tabshift=4 expandtab :*/

/*globals: define, require */
/*
 * css-parser.js
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */

/* jshint ignore:end */

var css_parser = (function(){
    "use strict";
    var idCount = 0;

    var appendCSSStyle = function(css, id) {
        if(css && typeof document !== "undefined") {
            var style = document.getElementById("style_" + id);
            if (style) {
                return style;
            }
            style = document.createElement("style");
            var head = document.head || document.getElementsByTagName("head")[0];

            style.type = "text/css";
            style.id = "style_" + id;
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
            return style;
        }
    };

    var functionString = function(parsed) {
        if (typeof document === "undefined")  // you are running optimization ( r.js )
            var document = createDocumentMock();

        var css = parsed.css;
        var attributeId = "data-style" + idCount;
        if ( css === false ) {
            return "";
        } else {
            if (parsed.scoped) {
                css = css
                    .replace(/(^|,)( *)\.([^ \s\n\r\t]+)[\s{]/gm, "$1$2[" + attributeId + "].$3");
            }
            css = css // turn into one line
                .replace(/([^\\])'/g, "$1\\'")
                .replace(/''/g, "'\\'")
                .replace(/[\n\r]+/g, " ")
                .replace(/ {2,20}/g, " ");
        }

        var result = "(" + appendCSSStyle.toString() + ")('" + css + "', " + idCount + ");\n";
        return result;
    };

    var createDocumentMock = function() {
        return {
            createElement: function() {},
            head: {},
            getElementsByTagName: function() {},
            createTextNode: function() {}
        };
    };

    var parseElement = function(doc) {
        idCount = idCount + 1;
        var queryResult = doc.getElementsByTagName("style");
        if (!queryResult || !queryResult.length) {
            return {
                id: 0,
                css: "",
                scoped: false,
                functionString: ""
            };
        }
        var style = queryResult[0];
        var scoped = style.hasAttribute("scoped");

        var result = {};
        result.css = style.innerHTML;
        result.id = idCount;
        result.scoped = scoped;
        result.functionString =  functionString(result);

        return result;
    };
    
    return {
        parseElement: parseElement
    };
})();

/*
 * template-parser.js
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */

/* jshint ignore:end */

var template_parser = (function(){
    var isOnBrowser = !!document;

    var parseOnBrowser = function(text, css_result) {
        var root;
        if (typeof text === "string") {
            root = document.createElement("div");
            root.insertAdjacentHTML("afterbegin", text);
        } else {
            root = text;
        }

        var queryResult = root.getElementsByTagName("template");
        if (!queryResult || !queryResult.length) {
            return "";
        }
        var template = queryResult[0];

        if (css_result.scoped) {
            template.innerHTML = template
                .innerHTML.replace(/([ \t]+class=['"])/g, " data-style" + css_result.id + "$1");
        }

        return clearTemplateText(template.innerHTML);
    };

    var clearTemplateText = function(text) {
        if (!text) {  return ""; }
        return text
            .replace(/([^\\])'/g, "$1\\'")
            .replace(/^(.*)$/mg, "'$1' + ") // encapsulate template code between ' and put a +
            .replace(/ {2,20}/g, " ") + "''";
    };

    var extractTemplate = function(text) {
        var start = text.indexOf("<template>");
        var end   = text.lastIndexOf("</template>");
        return clearTemplateText(text.substring(start + 10, end));
    };

    if (isOnBrowser) {
        extractTemplate = parseOnBrowser;
    }

    return {
        extractTemplate: extractTemplate
    };
    
})();

/*
 * vue.js
 *
 * Distributed under terms of the MIT license.
 */
/* global Promise */
/* jshint ignore:start */

/* jshint ignore:end */

var plugin = (function(){
    "use strict";

    var modulesLoaded = {};

    var functionTemplate = ["(function(template){", "})("];

    var parse = function(text) {
        var doc = document.implementation.createHTMLDocument("");
        doc.body.innerHTML = text;
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
                            if (xhttp.readyState === 4
                          && xhttp.status < 400) {
                                var result = parse(xhttp.responseText);
                                callback(result);
                                resolve(result);
                            }
                        };
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
})();

/**
 * vue.js
 * Copyright (C) 2017  
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */

/* jshint ignore:end */

define("vue", function(){
    return plugin;
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */

})();
