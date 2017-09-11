
var endDefine = /}\);[\n\r\s]*\/\*[^*]*\*\//g;
var rDefineSubmodule = /define\([""][^rv].*/;
var convertAmd = function (name, path, contents) {
    if(rDefineSubmodule.exec(contents)) {
        return contents
            .replace(rDefineSubmodule, "var " + name + " = (function(){")
            .replace(endDefine, "})();");
    } else {
        return contents.replace(/define\(([""][^""]+[""])\s*,.*/, "define($1, function(){");
    }
};

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            files: {
                src: "dist/require-vuejs.js",
                dest: "examples/require-vuejs.js"
            }
        },
        jsmeter: {
            all: {
                files: {
                    src: ["src/plugin.js"]
                },
                options: {
                    dest: "report/",
                    files: {
                        src: ["src/plugin"]
                    }
                }
            }
        },
        eslint: {
            options: {
                configFile: ".eslintrc.js"
            },
            target: [
                "./src/**/*.js",
                "./spec/**/*.js"
            ]
        },
        jscpd: {
            javascript: {
                path: "src/",
                exclude: []
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "./src",
                    findNestedDependencies: true,
                    logLevel: 0,
                    name: "<%= pkg.name %>", 
                    include: ["vue"], // needed to ensure that workds without need define paths 
                    onBuildWrite: convertAmd,
                    optimize: "uglify",
                    wrap: {
                        start: "(function() {",
                        end: "})();"
                    },
                    out: "./dist/<%= pkg.name %>.min.js",
                    skipModuleInsertion: true,
                    skipSemiColonInsertion: true
                }
            }, // compile
            dese: {
                options: {
                    baseUrl: "./src",
                    useStrict: true,
                    name: "<%= pkg.name %>", 
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
                    out: "./dist/<%= pkg.name %>.js"
                }
            } // dese
        } // requirejs
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-jsmeter");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-jscpd");

    grunt.registerTask("default", ["eslint", "jscpd", "requirejs:compile", "requirejs:dese", "copy"]);
};
