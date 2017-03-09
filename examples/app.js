/*
 * app.js
 * Copyright (C) 2017  <@BRSAECFS10>
 *
 * Distributed under terms of the MIT license.
 */

requirejs.config({
	paths: {
		"Vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.1/vue.min",
		"require-vuejs": "https://rawgit.com/edgardleal/require-vuejs/master/src/require-vuejs"
	},
	shim: {
		"Vue": {"exports": "Vue"},
		"require-vuejs": {deps: ["Vue"]} // automatically load when use Vue
	}
});

require(["Vue", "vue!component"], function(Vue){
	var app = new Vue({
		el: "#app"
	});
});
