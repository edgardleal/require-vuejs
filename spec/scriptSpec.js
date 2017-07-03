/*
 * scriptSpec.js
 * Copyright (C) 2017 Edgard Leal
 *
 * Distributed under terms of the MIT license.
 */
/* global describe, it, expect */
var requirejs = require("requirejs");

requirejs.config({
    baseUrl: __dirname + "/../src/",
    nodeRequire: require
});

var parser = requirejs("script_parser");

describe("Script parser", function() {
    "use strict";
    it("Extract simple", function() {
        var template = "<script>alert('ok')</script>";
        var result = parser.extractScript(template);

        expect(result).toEqual("alert('ok')");
    });
});

describe("Script with attributes", function() {

    it("<script with spaces", function() {
        var template = "<script  >alert('ok')</script>";
        var result = parser.extractScript(template);

        expect(result).not.toBe(null);
        expect(result).toEqual("alert('ok')");
    });

    it("<script x=\"32\">", function() {
        var template = "<script x=\"32\">alert('ok')</script>";
        var result = parser.extractScript(template);

        expect(result).not.toBe(null);
        expect(result).toEqual("alert('ok')");
    });

    it("<script data=\"main\" >", function() {
        var template = "<script data=\"main\" >alert('ok')</script>";
        var result = parser.extractScript(template);

        expect(result).not.toBe(null);
        expect(result).toEqual("alert('ok')");
    });

});

/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
