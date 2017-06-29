/**
 * pluginSpec.js
 * Copyright (C) 2017 eleal 
 *
 * Distributed under terms of the MIT license.
 */
/* global describe, it, expect, jasmine */
var requirejs = require("requirejs");

requirejs.config({
    baseUrl: __dirname + "/../src/",
    nodeRequire: require
});
var plugin = requirejs("plugin");

var componentScript = 
"(function(template){" + 
"    define(\"vue!component\", [\"Vue\"], function(Vue) {" + 
"        Vue.component(\"my-component\", {" + 
"            template: template," + 
"            data: function() {" + 
"                return {\"text\": \"Ok from component.vue\"};" + 
"            }" + 
"        });" + 
"    });" + 
"})(' <div>{{text}}</div>');";

describe("Script with attributes", function() {

    it("Setup", function() {
        expect(plugin).not.toBe(null);
        expect(plugin.load).not.toBe(null);
    });

    it("Callback", function() {
        var donefn = jasmine.createSpy("success");

        var todo = "todo";
        var onload = {
            // fromText: donefn
            fromText: function(text) {
                donefn(text.replace(/(\r\n|\r|\n)/gm, ""));
            }
        };

        var req = function(dep, callback) {

            callback();
        };

        req.toUrl = function(text) {
            return "examples/" + text;
        };

        plugin.load("component", req, onload, {isBuild: true});


        expect(donefn).toHaveBeenCalledWith(componentScript);
    });

});

/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
