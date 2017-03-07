/*global define, require, module, XMLHttpRequest, document */
define("vue", [], function(){
    return {
        load: function (name, req, onload, config) {
            var url = req.toUrl(name + '.vue');

            var functionTemplate = ["(function(template){",
              "})("];

            var extractTemplate = function(text) {
               var start = text.indexOf("<template>");
               var end   = text.indexOf("</template>");
               return text.substring(start + 10, end)
                 .replace(/([^\\])'/g, "$1\\'")
                 .replace(/[\n\r]+/g, "");
            };

            var extractScript = function(text) {
               var start = text.indexOf("<script>");
               var end = text.indexOf("</script>");
               return text.substring(start + 8, end);
            };
            
            var parse = function(text) {
               var template = extractTemplate(text);
               var source = extractScript(text);
               return functionTemplate[0] +
                  source +
                  functionTemplate[1] +
                  "'" + template + "');";
            };

            if(config.isBuild) {
               // TODO: optimize to r.js
            }
            var loadRemote = function(path, callback) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState === 4 && (this.status === 200 || this.status === 304)) {
                        callback(xhttp.responseText);
                    }
                };
                xhttp.open("GET", path, true);
                xhttp.send();
            };

            req([], function() {
                loadRemote(url, function(text){
                    var result = parse(text);
                    onload.fromText(result);
                });
            });
        }
    };
});
/*vim: set ts=4 ex=4 tabshift=4 :*/
