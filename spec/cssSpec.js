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

var parser = requirejs("css_parser");

describe("CSS parser", function() {
    "use strict";
    it("Extract simple", function() {
        var expected = "#id { display: none}";
        var template = "<style>#id { display: none}</style>";
        var result = parser.functionString(template);
        var expectedIndex = result.indexOf(expected);

        expect(expectedIndex).not.toBe(-1);
    });

    it("Without style tag", function() {
        var template = "<script> define(){} </script> <template> <div/> </template";
        var result = parser.functionString(template);

        expect(result).toEqual("");
    });
});

/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
