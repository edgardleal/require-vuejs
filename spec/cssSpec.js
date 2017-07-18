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

var document = requirejs("../spec/documentMock");

var parser = requirejs("css_parser");

describe("CSS parser", function() {
    "use strict";

    it("Setup", function() {
        expect(document).not.toBeNull();
        expect(document.head).not.toBeNull();
    });

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

    it("Full template", function() {
        var style = "#id { display: block;}"; 
        var template = "<style>" + style + "</style>" + 
            "<template> <<span></span> id='id'/></template>" + 
            "<script>define('component', [], function() { return {id: 999};});</script>";

        var head = document.head;
        expect(head.getElementsByTagName("style").length).toBe(0);
        var script = parser.functionString(template);
        eval(script);

        expect(head.getElementsByTagName("style").length).not.toBe(0);

    });
});

/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
