/**
 * pluginSpec.js
 * Copyright (C) 2017 eleal 
 *
 * Distributed under terms of the MIT license.
 */
/* global describe, it, expect, jasmine, waitsFor */
var requirejs = require("requirejs");
var define = requirejs.define;

requirejs.config({
    baseUrl: __dirname + "/../src/",
    nodeRequire: require,
    paths: {
        "Vue": "../node_modules/vue/dist/vue.common.js",
        "vue": "../node_modules/vue/dist/vue.common.js",
    }
});

var plugin   = requirejs("plugin");
var window   = requirejs("../spec/windowMock");
var document = requirejs("../spec/documentMock");
var Vue      = requirejs("Vue");
requirejs("vue-template-compiler");

describe("Plugin parser and execution", function() {

    it("Setup", function() {
        expect(plugin      ).not .toBeNull();
        expect(plugin.load ).not .toBeNull();
        expect(define      ).not .toBeNull();
        expect(window      ).not .toBeNull();
        expect(Vue.compile ).not .toBeNull();
    });

    it("Parser", function() {
        var donefn = jasmine.createSpy("success");

        var onload = {
            // fromText: donefn
            fromText: function(text) {
                eval(text);
                donefn("ok");
            }
        };

        var req = function(dep, callback) {

            callback();
        };

        req.toUrl = function(text) {
            return "examples/" + text;
        };

        plugin.load("component", req, onload, {isBuild: true});

        expect(donefn).toHaveBeenCalledWith("ok");
    });

    it("CSS Style setup", function() {
        expect(document).not.toBeNull();
        expect(document.head).not.toBeNull();
        expect(document.head.getElementsByTagName("style").length).not.toBe(0);
    });

    it("Structure of component", function() {
        var donefn = jasmine.createSpy("success");

        // expect(donefn).toHaveBeenCalledWith("ok");

        var component = requirejs("vue!component");
        component = new component().$mount("body");
        
        expect(component).not.toBeNull();
        expect(component).not.toBeUndefined();

        Vue.nextTick(function() {
            expect(component.text).toBe("Ok from component.vue");
            donefn("ok");
        });

        waitsFor(function() {
            return donefn.callCount > 0;
        }, "vm was mounted", 1000);

    });

});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
