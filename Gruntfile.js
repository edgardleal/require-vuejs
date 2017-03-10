module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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

    grunt.registerTask('default', ['requirejs:compile', 'requirejs:dese']);
};
