/*global define */

var dependencies = ["plugin"];

if (typeof define !== "function") {
    var define = require("amdefine")(module);
    dependencies[0] = __dirnname + "/" + dependencies[0];
}

define(["plugin"], function(vue){
    return vue;
});
/*vim: set ts=4 ex=4 tabshift=4 expandtab :*/
