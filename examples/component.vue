<template>
	<div>{{text}}</div>
</template>

<script>
    define(["Vue"], function(Vue) {
		Vue.component("my-component", {
			template: template,
			data: function() {
				return {"text": "Ok"};
			}
		});
    });
</script>
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 noexpandtab : */
