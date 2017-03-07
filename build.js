/*global define, require, DIR_APP, window, module */
/**
 *
 *
 * @author Edgard Leal
 */
'use strict';
var minify = require('minify');
var fs = require('fs');
minify('src/require-vue.js', function(err, source) {
    if(err) {
        console.log(err);
    } else {
        fs.writeFile("dist/require-vue.min.js", source, function(werr) {
            if(werr) {
                console.log(werr);
            }
        });
    }
});
