<template>
    <div>{{text}}</div>
</template>

<script>
    define(["Vue"], function(Vue) {
        var result = Vue.extend({
            template: template,
            data: function() {
                return {"text": "Ok from component.vue"};
            }
        });

        Vue.component("my-component", result); // register to be used

        // return to be used in unit tests 
        return result;
    });
</script>

<style>

div {
    border: 1px solid;
}

</style>
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 noexpandtab : */
