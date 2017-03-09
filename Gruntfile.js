module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
          compile: {
              options: {
                  baseUrl: './src',
                  // mainConfigFile: 'path/to/config.js',
                  name: 'require-vuejs', 
                  include: [ ],
                  paths: {
		              		"_cssparser": "css-parse",
                  },
                  out: './dist/require-vuejs.min.js'
              }
          }, // compile
          dese: {
              options: {
                  baseUrl: './src',
                  // mainConfigFile: 'path/to/config.js',
                  name: 'require-vuejs', 
                  include: [ ],
		              optimize: "none",
                  paths: {
		              		"_cssparser": "css-parse",
                  },
                  out: './dist/require-vuejs.js'
              }
          } // dese
        } // requirejs
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');

	  grunt.registerTask('default', ['requirejs:compile', 'requirejs:dese']);
};
