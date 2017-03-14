module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    define: true,
                    require: true,
                }
            },
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        },
        uglify: {
          options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
          },
          build: {
            src: 'src/<%= pkg.name %>.js',
            dest: 'dist/<%= pkg.name %>.min.js'
          }
        },
        requirejs: {
          compile: {
              options: {
                  baseUrl: './src',
                  name: '<%= pkg.name %>', 
                  include: [ ],
                  paths: {
                              "_cssparser": "css-parse",
                  },
                  out: './dist/<%= pkg.name %>.min.js'
              }
          }, // compile
          dese: {
              options: {
                  baseUrl: './src',
                  name: '<%= pkg.name %>', 
                  include: [ ],
                  optimize: "none",
                  paths: {
                      "_cssparser": "css-parse",
                  },
                  out: './dist/<%= pkg.name %>.js'
              }
          } // dese
        } // requirejs
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'requirejs:compile', 'requirejs:dese']);
};
