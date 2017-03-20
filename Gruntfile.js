module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsmeter: {
            all: {
                    files: {
                        src: ['src/plugin.js']
                    },
                options: {
                    dest: 'report/',
                    files: {
                        src: ['src/plugin']
                    }
                }
            }
        },
        jshint: {
            options: {
                boss: true,
                browser: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                node : true,
                sub: true,
                undef: true,
                unused: true,

                globals: {
                    XMLHttpRequest: true,
                    define: true,
                    jasmine: true,
                    describe: true,
                    beforeEach: true,
                    expect: true,
                    it: true,
                    require: true
                }
            },
            all: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js']
        },
        requirejs: {
          compile: {
              options: {
                  baseUrl: './src',
                  name: '<%= pkg.name %>', 
                  findNestedDependencies: true,
                  skipModuleInsertion: true,
                  logLevel: 0,
                  skipSemiColonInsertion: true,
                  wrap: true,
                  include: [
                      "vue"
                  ],
                  out: './dist/<%= pkg.name %>.min.js'
              }
          }, // compile
          dese: {
              options: {
                  baseUrl: './src',
                  useStrict: true,
                  name: '<%= pkg.name %>', 
                  findNestedDependencies: true,
                  // Avoid inserting define() placeholder
                  skipModuleInsertion: true,
                  logLevel: 0,

                  // Avoid breaking semicolons inserted by r.js
                  skipSemiColonInsertion: true,
                  wrap: {
                      start: "(function() {",
                      end: "})();"
                  },
                  include: [
                      "vue"
                  ],
                  optimize: "none",
                  out: './dist/<%= pkg.name %>.js'
              }
          } // dese
        } // requirejs
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsmeter');

    grunt.registerTask('default', ['jshint', 'requirejs:compile', 'requirejs:dese']);
};
