<template>
    <div>{{text}}</div>
</template>

<script>
    define(["Vue"], function(Vue) {
        var result = Vue.extend({
            template: template,
            data: function() {
                return {"text": "Component loaded using alias"};
            }
        });

        Vue.component("from-alias", result); // register to be used

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
