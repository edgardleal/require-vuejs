# require-vuejs
> RequireJS plugin to async and dynamic load and parse .vue single file components 

[![Build Status](https://travis-ci.org/edgardleal/require-vuejs.svg?branch=master)](https://travis-ci.org/edgardleal/require-vuejs)
[![Code Climate](https://codeclimate.com/github/edgardleal/require-vuejs/badges/gpa.svg)](https://codeclimate.com/github/edgardleal/require-vuejs)

This library has only 4Kb ( minified ).

## Features

* Real time integration 
* Don't need build to use
* Used as RequireJS plugin 
* You can use syntax detection from your IDE
* Suport for [single file component](https://vuejs.org/v2/guide/single-file-components.html)

## CDN 
Developent ( last version )


    https://rawgit.com/edgardleal/require-vuejs/master/dist/require-vuejs.js


For production usage: ( Fast CDN, long age cache and minified )

    https://cdn.rawgit.com/edgardleal/require-vuejs/aeaff6db/dist/require-vuejs.min.js

## Instalation from [NPM repository](https://www.npmjs.com/package/require-vuejs)

`npm install require-vuejs`


## Usage 

This example on [Codepen](http://codepen.io/edgardleal/pen/XMaeNP/)

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
            "vue": "https://rawgit.com/edgardleal/require-vue/master/dist/require-vuejs"
        },
        shim: {
            "Vue": {"exports": "Vue"}
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

