module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsmeter: {
            all: {
                    files: {
                        src: ['app.js']
                    },
                options: {
                    dest: 'report/',
                }
            }
        },
        requirejs: {
          compile: {
              options: {
                  baseUrl: './',
                  mainConfigFile: "app.js",
                  name: 'app', 
                      paths: {
                          "Vue": "node_modules/vue/dist/vue",
                       //   "vue": "node_modules/require-vuejs/src/require-vuejs"
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
                      //    "vue": "node_modules/require-vuejs/dist/require-vuejs"
                      },
                  include: [ ],
                  optimize: "none",
                  out: './dist/<%= pkg.name %>.js'
              }
          } // dese
        } // requirejs
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-jsmeter');

    grunt.registerTask('default', ['requirejs']);
};
