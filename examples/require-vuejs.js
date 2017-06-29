(function() {
/*globals: define, require */
/*
 * css-parser.js
 *
 * Distributed under terms of the MIT license.
 */

/* jshint ignore:start */

/* jshint ignore:end */

define("css_parser", [], function() {
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
            var head = document.head || document.getElementsByTagName("head")[0];

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
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */

/*
 * template-parser.js
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */

/* jshint ignore:end */

define('template_parser',[], function(){
  
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

/*
 * script-parser.js
 * Copyright (C) 2017 Edgard Leal
 *
 * Distributed under terms of the MIT license.
 */

/* jshint ignore:start */

/* jshint ignore:end */

define("script_parser", [], function() {
    return {
        findCloseTag: function(text, start) {
            var i = start;
            while(i < text.length && text[i++] !== ">");
            return i;
        },
        extractScript: function(text) {
            var start = text.indexOf("<script");
            var sizeOfStartTag = this.findCloseTag(text, start);
            var end = text.indexOf("</script>");
            return text.substring(sizeOfStartTag, end);
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */

/*
 * vue.js
 *
 * Distributed under terms of the MIT license.
 */

/* global Promise */
/* jshint ignore:start */

/* jshint ignore:end */

define('plugin',["css_parser", "template_parser", "script_parser"], function(css_parser, template_parser, script_parser) {

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
        if(text[0] === "\uFEFF") { // remove BOM ( Byte Mark Order ) from utf8 files 
            text = text.substring(1);
        }
        var parsed = parse(text).replace(/(define\()\s*(\[.*)/, "$1\"vue!" + name + "\", $2");
        return parsed;
    };

    return {
        normalize: function(name) {
            return name;
        },
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
                        onload.fromText(modulesLoaded[name]);
                    });
                }
            });
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */

/* jshint ignore:start */

/* jshint ignore:end */

define('require-vuejs',["plugin"], function(plugin){
    return plugin;
});
/*vim: set ts=4 ex=4 tabshift=4 expandtab :*/

/**
 * vue.js
 * Copyright (C) 2017  
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */

/* jshint ignore:end */

define("vue", ["plugin"], function(plugin) {
    return plugin;
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */

})();
