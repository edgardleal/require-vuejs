<template>
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">
                This component was loaded async trigged by vue-router 
            </p>
            <a class="card-header-icon">
                <span class="icon">
                    <i class="fa fa-angle-down"></i>
                </span>
            </a>
        </header>
        <div class="card-content">
            <div class="content">
                This component was loaded at: 
                <small v-text="loaded"></small>
            </div>
        </div>
        <footer class="card-footer">
            <a class="card-footer-item">Save</a>
            <a class="card-footer-item">Edit</a>
            <a class="card-footer-item">Delete</a>
        </footer>
    </div>

</template>

<script>
define(["Vue"], function(Vue) {

    var result = {
        template: template,
        data: function() {
            var time = new Date();
            return {
                loaded: time
            };
        }
    };

    Vue.component("vue-html", result);

    return result;
});
</script>
