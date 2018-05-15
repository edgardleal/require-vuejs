<template>
    <div class="box">
		<div>{{text}}</div>
		<a class="link" href="#" v-text="text"></a>
	</div>
</template>

<script>
    define(["Vue"], function(Vue) {
        var result = Vue.extend({
            template: template,
            data: function() {
                return {"text": "Ok from component.vue using scoped css"};
            }
        });

        Vue.component("my-component", result); // register to be used

        // return to be used in unit tests 
        return result;
    });
</script>

<style scoped>

.box {
	height: 50px;
}

.link:hover {
    content: '';
	  color: red;
}
div {
    border: 1px solid;
}

</style>
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 noexpandtab : */
