/*
 * app.js
 *
 * Distributed under terms of the MIT license.
 */

requirejs.config({
	paths: {
		"Vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.1/vue.min",
		"vue": "https://rawgit.com/edgardleal/require-vue/master/src/require-vue"
	},
	shim: {
		"Vue": {"exports": "Vue"}
	}
});

require(["Vue", "vue!component"], function(Vue){
	var app = new Vue({
		el: "#app"
	});
});
