/*
 * template-parser.js
 *
 * Distributed under terms of the MIT license.
 */
/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
/* jshint ignore:end */

define("template_parser", [], function(){
    var isOnBrowser = !!document;

    var parseOnBrowser = function(text, css_result) {
        var root;
        if (typeof text === "string") {
            root = document.createElement("div");
            root.insertAdjacentHTML("afterbegin", text);
        } else {
            root = text;
        }

        var queryResult = root.getElementsByTagName("template");
        if (!queryResult || !queryResult.length) {
            return "";
        }
        var template = queryResult[0];

        if (css_result.scoped) {
            //template.innerHTML = template
            //    .innerHTML.replace(/([ \t]+class=['"])/g, " data-style" + css_result.id + "$1");

            // 优化 css scoped 实现 2022-12-1
            let scopedAttr = " data-style" + css_result.id

            // 先处理 css html tag
            //let tagRe = /(?:(^|\s+|#)[\w-]+)\s*{/g
            let tagRe = /(?:(^|\s+)[\w-]+)\s*{/g
            if (tagRe.test(css_result.css)) {
                // 获取css定义的html tags
                let cssTags = css_result.css.match(tagRe)

                // 预处理
                let tagNames = []
                cssTags.forEach(tag => {
                    // 去除末尾大括号'{' 及空 
                    let tagName = tag.substring(0, tag.length - 1).trim()
                    // 去重
                    if (!tagNames.includes(tagName)) {
                        tagNames.push(tagName)
                    }
                })

                // 构造RegExp，结果类似：/<(img|h1)( |>)/g
                let htmlRe = new RegExp('<(' + tagNames.join('|') + ')( |>)', 'g')

                // 添加局部属性标识
                template.innerHTML = template
                    .innerHTML.replace(htmlRe, "<$1" + scopedAttr + " $2");
            }

            // 后处理 class
            template.innerHTML = template
                .innerHTML.replace(/([ \t:]+class=['"])/g, scopedAttr + "$1");
        }

        return clearTemplateText(template.innerHTML);
    };

    var clearTemplateText = function(text) {
        if (!text) {  return ""; }
        return text
            .replace(/([^\\])'/g, "$1\\'")
            .replace(/^(.*)$/mg, "'$1' + ") // encapsulate template code between ' and put a +
            .replace(/ {2,20}/g, " ") + "''";
    };

    var extractTemplate = function(text) {
        var start = text.indexOf("<template>");
        var end   = text.lastIndexOf("</template>");
        return clearTemplateText(text.substring(start + 10, end));
    };

    if (isOnBrowser) {
        extractTemplate = parseOnBrowser;
    }

    return {
        extractTemplate: extractTemplate
    };
    
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
