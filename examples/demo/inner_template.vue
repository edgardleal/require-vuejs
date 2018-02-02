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
              <template v-if="isVisible">
                This component was loaded at: 
                <br/>
                Seccond item: 
                <small v-text="'Inside inner template'"></small>
                <template v-for="item in list">
                   <br/>
                   <span> Using many itens inside a template with loop </span>
                </template>
              </template>
            </div>
        </div>
        <footer class="card-footer">
            <a class="card-footer-item" @click="isVisible = !isVisible">
              Toggle
            </a>
            <a class="card-footer-item">Edit</a>
            <a class="card-footer-item">Delete</a>
        </footer>
    </div>

</template>

<script>

define([], function() {
    return {
      template: template,
      data: function() {
        return {
          list: [1, 2, 3],
          isVisible: true,
        };
      }
    };
});

</script>
