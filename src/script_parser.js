/*
 * script-parser.js
 * Copyright (C) 2017 Edgard Leal
 *
 * Distributed under terms of the MIT license.
 */

/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
/* jshint ignore:end */

define("script_parser", [], function() {
    return {
        findCloseTag: function(text, start) {
            var i = start;
            while(i < text.length && text[i++] !== ">");
            return i;
        },
        extractScript: function(text) {
            var start = text.indexOf("<script"); // I don't know why, but someone could use attributes on script tag
            var sizeOfStartTag = this.findCloseTag(text, start);
            var end = text.indexOf("</script>");
            return text.substring(sizeOfStartTag, end);
        }
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
