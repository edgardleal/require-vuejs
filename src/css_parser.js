/*globals: define, require */
/*
 * css-parser.js
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
/* jshint ignore:end */

define("css_parser", [], function() {
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
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
