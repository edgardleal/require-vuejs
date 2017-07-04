module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
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
        copy: {
            files: {
                src: "dist/require-vuejs.js",
                dest: "examples/require-vuejs.js"
            }
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
                    // onBuildWrite: convertAmd,
                    optimize: "uglify",
                    out: "./dist/<%= pkg.name %>.min.js",
                    skipModuleInsertion: true,
                    skipSemiColonInsertion: true,
                    wrap: true
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
                    // onBuildWrite: convertAmd,
                    out: "./dist/<%= pkg.name %>.js"
                }
            } // dese
        } // requirejs
    });

    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-jsmeter");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-jscpd");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("default", ["eslint", "jscpd", "requirejs:compile", "requirejs:dese", "copy"]);
};
