/* global requirejs, require */
/**
 * app.js
 *
 * Distributed under terms of the MIT license.
 */

requirejs.config({
    paths: {
        "Vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min",
        "vue": "https://rawgit.com/edgardleal/require-vue/master/dist/require-vuejs",
        "vue-router": "https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.7.0/vue-router.min"
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
        { path: "/inner", component: asyncComp("vue!/demo/inner_template")},
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
