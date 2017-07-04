/*
 * documentMock.js
 * Copyright (C) 2017  
 *
 * Distributed under terms of the MIT license.
 */
define([], function() {
    "use strict";
    var BaseNode = function(tagName) {
        this.tagName = tagName;
        this.childs = [];
        this.appendChild = function(node) {
            this[node.tagName] = node;
            this.childs.push(node);
        };
        this.createElement = function(tag) {
            return new BaseNode(tag);
        };
        this.createTextNode = function(text) {
            var result = new BaseNode("div");
            result.innerText = text;
            return result;
        };

        this.getElementsByTagName = function(name) {
            var result = [];
            for(var i in this.childs) {
                if ( this.childs[i].tagName === name ) {
                    result.push(this.childs[i]);
                }
            }

            return result;
        };

        this.querySelector = function(query) {
            return this.getElementsByTagName(query);
        };
    };

    var result = new BaseNode();
    result.appendChild(new BaseNode("head"));
    result.appendChild(new BaseNode("body"));

    return result;
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
