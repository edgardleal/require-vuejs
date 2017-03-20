/*globals: define, require */
/*
 * css-parser.js
 *
 * Distributed under terms of the MIT license.
 */

if (typeof define !== "function") {
    var define = require("amdefine")(module);
}

define("css-parser", [], function() {
    'use strict';
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
            var css = extractCss(text);
            appendCSSStyle(css);
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
