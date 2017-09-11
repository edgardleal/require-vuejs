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
  
    var extractTemplate = function(text) {
        var start = text.indexOf("<template>");
        var end   = text.lastIndexOf("</template>");
        return text.substring(start + 10, end)
            .replace(/([^\\])'/g, "$1\\'")
            .replace(/^(.*)$/mg, "'$1' + ") // encapsulate template code between ' and put a + 
            .replace(/ {2,20}/g, " ") + "''";
    };


    return {
        extractTemplate: extractTemplate
    };
    
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
