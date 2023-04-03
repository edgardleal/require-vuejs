/*globals: define, require */
/*
 * css-parser.js
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
/* jshint ignore:end */

define("css_parser", [], function() {
    "use strict";
    var idCount = 0;

    var appendCSSStyle = function(css, id) {
        if(css && typeof document !== "undefined") {
            var style = document.getElementById("style_" + id);
            if (style) {
                return style;
            }
            style = document.createElement("style");
            var head = document.head || document.getElementsByTagName("head")[0];

            style.type = "text/css";
            style.id = "style_" + id;
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
            return style;
        }
    };

    var functionString = function(parsed) {
        if (typeof document === "undefined")  // you are running optimization ( r.js )
            var document = createDocumentMock();

        var css = parsed.css;
        var attributeId = "data-style" + idCount;
        if ( css === false ) {
            return "";
        } else {
            if (parsed.scoped) {
                //css = css
                //    .replace(/(^|,)( *)\.([^ \s\n\r\t]+)[\s{]/gm, "$1$2[" + attributeId + "].$3");

                /* 修改 css scoped 实现，2021-6-17 */
                // 匹配html tag或 css类
                // css html tag -- \s+[\w-]+
                // css class -- \.[\w-]+
                css = css.replace(/(\s+[\w-]+|\.[\w-]+)\s*{/gm, "$1[" + attributeId + "] {");
            }
            css = css // turn into one line
                .replace(/([^\\])'/g, "$1\\'")
                .replace(/''/g, "'\\'")
                .replace(/[\n\r]+/g, " ")
                .replace(/ {2,20}/g, " ");
        }

        var result = "(" + appendCSSStyle.toString() + ")('" + css + "', " + idCount + ");\n";
        return result;
    };

    var createDocumentMock = function() {
        return {
            createElement: function() {},
            head: {},
            getElementsByTagName: function() {},
            createTextNode: function() {}
        };
    };

    var parseElement = function (doc) {
        // todo: 以下实现，同一个文件由于加载次序不同，style id会不同
        // 在《systemjs+compiler-sfc 实现浏览器端渲染 .vue 文件》中
        // https://zhuanlan.zhihu.com/p/408745521，用以下算法实现：
        // return res.text().then(function (source) {
        // var id = hash.sum(url + source);
        // var dataVId = 'data-v-' + id;
        // 这样的 style id 只于文件本身有关，与加载次序无关，可以借鉴
        idCount = idCount + 1;
        var queryResult = doc.getElementsByTagName("style");
        if (!queryResult || !queryResult.length) {
            return {
                id: 0,
                css: "",
                scoped: false,
                functionString: ""
            };
        }
        var style = queryResult[0];
        var scoped = style.hasAttribute("scoped");

        var result = {};
        result.css = style.innerHTML;
        result.id = idCount;
        result.scoped = scoped;
        //result.functionString =  functionString(result);

        //return result;

        /* for less.js override */
        if (!checkLess(style)) {
            result.functionString = functionString(result);
            return result
        }

        return parseLess(result);
    };

    // 是否解析less
    var checkLess = function (rawStyle) {
        // 非 less
        if (!rawStyle.hasAttribute("lang")
            || rawStyle.getAttribute("lang").toLowerCase() != "less") {
            return false;
        }
        // 无 less.js
        if (!less || !less.render) {
            return false
        }

        return true
    }

    var parseLess = function (parsedStyle) {
        let parse_result = parsedStyle;

        // 调用 less.js 解析less
        less.render(parse_result.css, function (err, less_result) {
            if (err) {
                console.log(err);
                console.log("parsed style =>");
                console.log(parse_result);
            }
            else {
                parse_result.css = less_result.css;
                parse_result.functionString = functionString(parse_result);
            }
        });

        return parse_result;
    }

    return {
        parseElement: parseElement
    };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
