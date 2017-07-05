/* global requirejs, require */
/**
 * app.js
 *
 * Distributed under terms of the MIT license.
 */

requirejs.config({
    paths: {
        "Vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.1/vue",
        "vue": "/node_modules/require-vuejs/dist/require-vuejs",
        "vue-router": "/node_modules/vue-router/dist/vue-router"
    },
    shim: {
        "Vue": {"exports": "Vue"}
    }
});

require(["Vue", "vue-router"], function(Vue, VueRouter){
    Vue.use(VueRouter);
    var asyncComp = function(componentName) {
        return function(resolve) {
            require([componentName], resolve);
        };
    };

    var router = new VueRouter({routes: [
        { path: "/home" , component: asyncComp("vue!/demo/home")},
        { path: "/html" , component: asyncComp("vue!/demo/component.html")},
        { path: "/vue"  , component: asyncComp("vue!/demo/component")},
        { path: "/async", component: asyncComp("vue!/demo/async")},
    ]});

    new Vue({
        data: {
            started: new Date()
        },
        router: router,
        el: "#app"
    });
});
