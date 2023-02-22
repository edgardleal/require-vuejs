/*
 * 模板预处理器：对单标记、驼峰命名属性等作预处理
 * @author: shiyl962@hotmail.com, 2021-6-15
 */
/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
/* jshint ignore:end */

define("template_preprocessor", [], function () {
    "use strict";
    // 单边标记规则
    let tagRegExp = /<([a-zA-Z-]+)[^<]*\/>/g;

    // 标准单边标记，不需要转换
    let excludeTags = ['img', 'hr', 'br', 'input'];

    var sideTagHandler = function (text) {
        if (!tagRegExp.test(text))
            return text;

        let tmpText = text.replace(tagRegExp, function (tagAll, tagName) {
            if (excludeTags.indexOf(tagName) > -1)
                return tagAll;

            return tagAll.replace("/>", "></" + tagName + ">");
        });

        return tmpText;
    };

    // 由于 vue 的 v-on 事件监听器在 DOM 模板中会被自动转换为全小写
    // 类似 this.$emit('toggleCollapse') 事件, 只能用 vm.$on(...) 绑定
    // 详见：https://cn.vuejs.org/v2/guide/components-custom-events.html

    // 小驼峰命名规则(kebab-case)
    // 说明：
    // 属性或事件引导符 -- [\s:@]
    // 小驼峰命名属性 -- [a-z1-9]+([A-Z][a-z1-9]+)+
    // 先行断言，属性后续 -- (?=(\s*=\s*".*?"|\s+|\/?>))
    //      (1) 标准属性 -- \s*=\s*".*?"
    //      (2) 空或结束标记 -- \s+|\/?>
    // todo: 会匹配属性内容中的小驼峰命名，如以下html中的 searchActive
    // <header-search class="header-item" @active="val => searchActive = val">
    //let camelAttrReg = /[\s:@]([a-z1-9]+([A-Z][a-z1-9]+)+)(?=(\s*=\s*".*?"|\s+|\/?>))/g;
    //let camelAttrReg = /[\s:@]([a-z0-9]+([A-Z][a-z0-9]+)+)(?=(\s*=\s*".*?"|(\x20\/)?>))/g;

    // html tag
    //let htmlTagReg = /<([\w-]+)\s[^<]*\/?>/g;
    let htmlTagReg = /<\w[^<]+>/g;

    // 小驼峰命名规则
    let kebabTestReg = /[\s:@]([a-z0-9]+([A-Z][a-z0-9]+)+)(?=(\s*=\s*".*?"|\s+|\/?>))/
    let kebabCaseReg = new RegExp(kebabTestReg, 'g')

    // attribute content
    let attrContentReg = /=\s*"[^"]*?(?:[a-z0-9]+(?:[A-Z][a-z0-9]+)+)[^"]*?"/g

    var camelHandler = function (text) {
        if (!kebabTestReg.test(text))
            return text;

        let tmpText = text.replace(htmlTagReg, function (tagAll) {
            // 清除属性内容，排除干扰项
            let clearText = tagAll
            if (attrContentReg.test(clearText)) {
                clearText = tagAll.replace(attrContentReg, function (attrContent) {
                    return attrContent.replace(/=\s*"[^"]*?"/g, "=\"\"")
                })
            }

            if (!kebabTestReg.test(clearText))
                return tagAll;

            // 替换小驼峰命名属性
            let kebabMatches = clearText.matchAll(kebabCaseReg);
            Array.from(kebabMatches, function (x) {
                let tagAttr = x[0]
                let lowerAttr = tagAttr.replace(/[A-Z]/g, "-$&").toLowerCase();
                //let tagAllParts = tagAll.split(tagAttr)
                //tagAll = tagAllParts[0] + lowerAttr + tagAllParts[1]
                tagAll = tagAll.replace(tagAttr, lowerAttr)
                //console.log("camelHandler =>", tagAttr, lowerAttr, tagAll.substring(0, tagAll.indexOf('>') + 1) + '...');
            });

            return tagAll;
        });

        return tmpText;
    }

    return {
        handle: function (vueText) {
            let tplStart = vueText.indexOf("<template>");
            let tplEnd = vueText.lastIndexOf("</template>");
            if (tplStart == -1 || tplEnd == -1 || tplEnd - tplStart <= "<template>".length)
                return vueText;

            let template = vueText.substring(tplStart + "<template>".length, tplEnd);

            //预处理html单标记
            template = sideTagHandler(template);
            //预处理驼峰属性
            template = camelHandler(template);

            let vueText1 = vueText.substring(0, tplStart + "<template>".length);
            let vueText2 = vueText.substring(tplEnd);
            let result = vueText1 + template + vueText2;

            return result;
        }
    }
});
/* for Gruntfile endDefine */