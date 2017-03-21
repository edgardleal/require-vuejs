module.exports = function(grunt) {

    var endDefine = /}\);[\n\r\s]*\/\*[^\*]*\*\//g;
    var rDefineSubmodule = /define\(["'][^rv].*/;
    function convertAmd(name, path, contents) {
        if(rDefineSubmodule.exec(contents)) {
            return contents
                    .replace(rDefineSubmodule, "var " + name + " = (function(){")
                    .replace(endDefine, "})();");
        } else {
            return contents.replace(/define\((["'][^'"]+['"])\s*,.*/, "define($1, function(){");
        }
    }

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
                    Promise: true,
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
                  findNestedDependencies: true,
                  logLevel: 0,
                  name: '<%= pkg.name %>', 
                  include: ["vue"], // needed to ensure that workds without need define paths 
                  onBuildWrite: convertAmd,
                  optimize: "uglify",
                  out: './dist/<%= pkg.name %>.min.js',
                  skipModuleInsertion: true,
                  skipSemiColonInsertion: true,
                  wrap: true
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
                  include: ["vue"], // needed to ensure that workds without need define paths 
                  wrap: {
                      start: "(function() {",
                      end: "})();"
                  },
                  optimize: "none",
                  onBuildWrite: convertAmd,
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
