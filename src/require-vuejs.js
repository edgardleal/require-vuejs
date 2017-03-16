/*global define */

var dependencies = ["plugin"];
/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
    dependencies[0] = __dirnname + "/" + dependencies[0];
}
/* jshint ignore:end */

define("require-vuejs", dependencies, function(vue){
    return vue;
});
/*vim: set ts=4 ex=4 tabshift=4 expandtab :*/
