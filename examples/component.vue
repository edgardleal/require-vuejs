<template>
    <div>{{text}}</div>
</template>

<script>
    define(["Vue"], function(Vue) {
        Vue.component("my-component", {
            template: template,
            data: function() {
                return {"text": "Ok from component.vue"};
            }
        });
    });
</script>

<style>

div {
    border: 1px solid;
}

</style>
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 noexpandtab : */
