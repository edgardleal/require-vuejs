/*
 * template-parser.js
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
/* jshint ignore:end */

define("template_parser", [], function(){
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
    
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
