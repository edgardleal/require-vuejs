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
                  include: [ ],
                  out: './dist/<%= pkg.name %>.min.js'
              }
          }, // compile
          dese: {
              options: {
                  baseUrl: './src',
                  name: '<%= pkg.name %>', 
                  include: [ ],
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
