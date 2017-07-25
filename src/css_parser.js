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
        if(css && typeof document !== "undefined") {
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

    var createDocumentMock = function() {
        return {
            createElement: function() {},
            head: {},
            getElementsByTagName: function() {},
            createTextNode: function() {}
        };
    };
    
    return {
        extractCss: extractCss,
        appendCSSStyle: appendCSSStyle,
        functionString: function(text) {
            if (typeof document === "undefined")  // you are running optimization ( r.js )
                var document = createDocumentMock(); // var put it on start of scope 

            var css = extractCss(text);
            if ( css === false ) {
                return "";
            } else {
                css = css
                    .replace(/([^\\])'/g, "$1\\'")
                    .replace(/[\n\r]+/g, "")
                    .replace(/ {2,20}/g, " ");
            }

            var result = "(" + appendCSSStyle.toString() + ")('" + css + "');";
            return result;
        },
        parse: function(text) {
            var css = extractCss(text);
            appendCSSStyle(css);
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
