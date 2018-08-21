/* global requirejs, require */
/**
 * app.js
 *
 * Distributed under terms of the MIT license.
 */

requirejs.config({
    waitSeconds: 1,
    paths: {
        "Vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue",
        "vue": ["require-vuejs", "https://rawgit.com/edgardleal/require-vuejs/master/dist/require-vuejs"],
        "alias": "using_alias"
    },
    shim: {
        "Vue": {"exports": "Vue"}
    }
});

require([
   "Vue", 
   "vue!js_in_different_file",
   "vue!component", 
   "vue!component.html", 
   "vue!using_alias",
   ], function(Vue, comp){

    window.Vue = Vue;
    Vue.component('count-click', comp);
    new Vue({
        el: "#app"
    });
});
