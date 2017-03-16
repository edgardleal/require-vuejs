module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
          compile: {
              options: {
                  baseUrl: './',
                  name: 'app', 
                      paths: {
                          "Vue": "node_modules/vue/dist/vue",
                          "vue": "node_modules/require-vuejs/src/require-vuejs"
                      },
                  out: './dist/<%= pkg.name %>.min.js'
              }
          }, // compile
          dese: {
              options: {
                  baseUrl: './',
                  name: 'app', 
                      paths: {
                          "Vue": "node_modules/vue/dist/vue",
                          "vue": "node_modules/require-vuejs/src/require-vuejs"
                      },
                  include: [ ],
                  optimize: "none",
                  out: './dist/<%= pkg.name %>.js'
              }
          } // dese
        } // requirejs
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('default', ['requirejs']);
};
