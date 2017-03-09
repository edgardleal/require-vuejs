# require-vuejs
> RequireJS plugin to async and dynamic load and parse .vue components 

[![Build Status](https://travis-ci.org/edgardleal/require-vuejs.svg?branch=master)](https://travis-ci.org/edgardleal/require-vuejs)

This library has only 8Kb ( minified ).

## CDN 
Developent ( last version )


    https://rawgit.com/edgardleal/require-vue/master/src/require-vue.js


For production usage: ( Fast CDN, long age cache )


    https://cdn.rawgit.com/edgardleal/require-vue/49f98a03/dist/require-vue.min.js

## Instalation

`npm install require-vuejs`


## Usage 

index.html


    <!DOCTYPE html>
    <html>
        <head>
        <meta charset="utf-8" />
            <title>Require Vue</title>
        </head>
        <body>
            <div id="app">
                <my-component></my-component>
        </div>
            <script data-main="app" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min.js" ></script>
            <script src="" ></script>
        </body>
    </html>

---

Create your component:  ( component.vue )

    <template>
      <div>
          {{text}}
      </div>
    
    </template>
    
    <script>
      define(["Vue"], function(Vue) {
          Vue.component("my-component", {
              template: template, // the variable template will be injected 
              data: function() {
                  return {"text": "Ok"};
              }
          });
        });
    </script>

---

Create your app code: ( app.js )

    requirejs.config({
        paths: {
            "Vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.1/vue.min",
            "require-vue": "https://rawgit.com/edgardleal/require-vue/master/src/require-vue"
        },
        shim: {
            "Vue": {"exports": "Vue"},
            "require-vue": {deps: ["Vue"]} // automatically load when use Vue
        }
    });
    
    require(["Vue", "vue!component"], function(Vue){
        var app = new Vue({
            el: "#app"
        });
    });



## Licence  
MIT

## Code of Conduct  

[https://js.foundation/conduct/](https://js.foundation/conduct/)

