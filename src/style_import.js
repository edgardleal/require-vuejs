
/* jshint ignore:start */
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
/* jshint ignore:end */

/**
 * 获取requirejs 实例的 context，此法可获取配置、路径定义、已加载模块、内部方法等
 * 参考: (1) Hot Module Replacement，
 *       https://github.com/requirejs/requirejs/issues/1760 
 *       (2) Simplest way to hot reload your React Components with RequireJS 
 *       https://bunkernetz.com/2015/11/02/simplest-way-to-hot-reload-your-react-components-with-requirejs/
 */
const rj_context = require.s.contexts._

/**
 * sfc style @import
 * @author: shiyl962@hotmail.com, 2023-2-1
 */
define("style_import", [], function () {
    "use strict";
    /*=========================================================================
     * 以下函数trimDots(...)、normalize(...) 复制自 require.js，类似处理路径的库：
     * (1) This is an exact copy of the NodeJS ’path’ module published to the NPM registry.
     *     https://github.com/jinder/path/blob/master/path.js
     * (2) 使用Javascript将相对路径地址转换为绝对路径
     *     http://ourjs.com/detail/5320190bb79767cf7b000003
     * 以上库的本地文件：path.js、absPath.js
     *========================================================================*/
    /**
    * Trims the . and .. from an array of path segments.
    * It will keep a leading path segment if a .. will become
    * the first path segment, to help with module name lookups,
    * which act like paths, but can be remapped. But the end result,
    * all paths that use this function should look normalized.
    * NOTE: this method MODIFIES the input array.
    * @param {Array} ary the array of path segments.
    */
    function trimDots(ary) {
        var i, part;
        for (i = 0; i < ary.length; i++) {
            part = ary[i];
            if (part === '.') {
                ary.splice(i, 1);
                i -= 1;
            } else if (part === '..') {
                // If at the start, or previous value is still ..,
                // keep them so that when converted to a path it may
                // still work when converted to a path, even though
                // as an ID it is less than ideal. In larger point
                // releases, may be better to just kick out an error.
                if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
                    continue;
                } else if (i > 0) {
                    ary.splice(i - 1, 2);
                    i -= 2;
                }
            }
        }
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var normalizedBaseParts, lastIndex,
            baseParts = (baseName && baseName.split('/'));

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            trimDots(name);
            name = name.join('/');
        }

        return name;
    }

    // style section 预处理
    // 全部注释的<style>部分
    const commentStyle = /<!--\s*<style.*>[\s\S]*?<\/style>\s*-->/
    // 含有注释及@import的<style>部分
    // 注释 -- \s*(\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*)*\s*, /* ... */ 或 // ...
    // 导入 -- @import\s+["|'](.+)["|'];?
    const testImport = /<style.*>\s*(\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*)*\s*@import\s+["'].+?["']\s*;?/gm
    // @import
    const findImport = /^\s*@import\s+["'](.+?)["']\s*;?/gm;

    /**
     * sfc 文本预处理，提取<style>部分@import 文件路径
     * @param {String} text sfc 文本
     * @return: 无@import时，返回false
     *          否则返回@import 文件路径数组及合并文本方法
     */
    var preprocess = function (text) {
        // 清除注释
        let clearText = text.replace(commentStyle, '')

        // 测试有无导入项
        if (testImport.test(clearText) === false /*&& testImport.test(clearText) === false*/) {
            debugInfo(clearText)
            return false
        }

        // 按<style ...>...</style> 分为三部分
        let styleStart = clearText.indexOf('<style')
        let styleStartRight = clearText.indexOf('>', styleStart)
        // 包括<style ...>的前面部分
        let startText = clearText.substring(0, styleStartRight + 1)

        // 包括</style>的后面部分
        let styleEnd = clearText.indexOf('</style', styleStartRight)
        let endText = styleEnd > styleStartRight ? clearText.substring(styleEnd) : ''

        // <style ...>...</style>之间的部分，即css或less
        let styleContent = styleEnd > styleStartRight ? clearText.substring(styleStartRight + 1, styleEnd)
            : clearText.substring(styleStartRight + 1)

        // 约定<style>部分有@import导入时，不允许定义less或css项
        if (/\.[\w-]+\s*{/gm.test(styleContent)) {
            let exception = '<style>部分有@import导入，不允许定义其它less或css项';
            console.error(exception + ' :' + styleContent)
            throw exception;
        }

        // 解析导入文件
        let matches
        let imports = []
        while (matches = findImport.exec(styleContent)) {
            //styleContent = styleContent.replace(matches[0], '')
            imports.push(matches[1])
        }
        //console.log('style_import.preprocess =>', imports)

        const joinLoaded = reqResults => startText + ''.concat(reqResults) + endText

        return { imports, joinLoaded }
    }

    // 辅助调试
    function debugInfo(docText) {
        // <style> 含有 @import
        const checkSfc = ['WorkPlace.vue', 'AdminHeader.vue', 'SideMenu.vue', 'PageHeader.vue']

        // 当前请求是否以上组件
        let chkResult = checkSfc.filter(sfc => baseUrl.endsWith(sfc))
        if (chkResult.length > 0) {
            console.log('style_import.preprocess.url =>', baseUrl)
            //console.log('style_import.preprocess.text =>', text)
            console.log('style_import.preprocess.clearText =>', clearText)
        }
    }

    // 构造异步加载对象
    let localRequire, baseUrl;
    var loadFiles = function (imports) {
        let reqFiles = []
        imports.forEach(path => {
            // 路径转换
            let filePath = normalize(path, baseUrl, false)
            let reqUrl = localRequire.toUrl(filePath)
            //console.log('style_import.toUrl =>', baseUrl, path, reqUrl)

            let promise = new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.timeout = (rj_context.config.waitSeconds || 5) * 1000
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(xhr.responseText)
                        } else {
                            reject(xhr.status)
                            throw "No response available for request:" + reqUrl + ", status code: " + xhr.status
                        }
                    }
                }
                xhr.onerror = function (e) {
                    reject(e)
                    throw "Error loading: " + reqUrl;
                }
                xhr.ontimeout = function (e) {
                    reject(e)
                    throw "Timeout loading: " + reqUrl;
                }
                xhr.open('GET', reqUrl)
                xhr.send()
            })

            reqFiles.push(promise)
        })

        return reqFiles
    }

    return {
        /**
         * 实现 sfc <style>部分 @import，与其他部分合并
         * @param {String} url sfc 加载url
         * @param {String} text 已加载的sfc 文本
         * @param {Object} req localRequire 实例
         */
        loadAndMerge: function (url, text, req) {
            localRequire = req
            baseUrl = url

            // 预处理
            let procResult = preprocess(text)
            //console.log('style_import.loadAndMerge =>', url, procResult)

            // 无@import, 返回已加载text
            if (procResult === false) {
                return Promise.resolve(text);
            }

            // 实现@import
            return new Promise(function (resolve, reject) {
                let responses = loadFiles(procResult.imports)
                Promise.all(responses)
                    .then(reqResults => {
                        //console.log('style_import.Promise.all =>', responses, url, reqResults)
                        let docText = procResult.joinLoaded(reqResults)
                        resolve(docText)
                    }).catch(reqFail => {
                        //console.log('style_import.Promise.fail =>', responses, url, reqFail)
                        reject(reqFail)
                    })
            });
        }
    }
});
/* for Gruntfile endDefine */