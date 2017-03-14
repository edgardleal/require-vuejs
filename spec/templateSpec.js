/*
 * templateSpec.js
 *
 * Distributed under terms of the MIT license.
 */


var requirejs = require("requirejs");

requirejs.config({
    baseUrl: __dirname + "/../src/",
    nodeRequire: require
});

describe("Setup", function() {
'use strict';
    it("require", function() {
        expect(require).not.toBe(null);
        var css = requirejs("css-parser");
        expect(css).not.toBe(null);
        expect(requirejs("vue")).not.toBe(null);
    });
});

describe("Parser Templates", function() {
    var parser = requirejs("template-parser");

    beforeEach(function() {

    });

    it("Simple br", function() {
        var template = "<templete>" +
            "<br/></template>";

        var result = parser.extractTemplate(template);

        expect(result).toMatch("<br/>");
    });

    it("Multiline", function() {
        var template = "<template>\n" +
            "  <input/>   <label>Test</label>\n" + 
            "  </template>";
        var result = parser.extractTemplate(template);
        var expected = " <input/> <label>Test</label> ";

        expect(result).toMatch(expected);
    
    });

});

/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
