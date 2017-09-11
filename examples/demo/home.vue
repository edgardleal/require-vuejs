<template>
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">
                HOME
            </p>
            <a class="card-header-icon">
                <span class="icon">
                    <i class="fa fa-angle-down"></i>
                </span>
            </a>
        </header>
        <div class="card-content">
            <div class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                <a>@bulmaio</a>. <a>#css</a> <a>#responsive</a>
                <br>
                <small v-text="now"></small>
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

    return Vue.component("vue-home", {
        template: template,
        data: function() {
            return {
                now: new Date()
            };
        },
        mounted: function() {
            this.refresh();
        },
        methods: {
            refresh: function() {
                this.now = new Date();
                setTimeout(this.refresh, 2000);
            }
        }
    });

});
</script>
