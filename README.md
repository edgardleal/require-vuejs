# require-vuejs
> RequireJS plugin to async and dynamic load and parse .vue single file components 

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e431a6e1ba314ba7a4b3debfc9643503)](https://www.codacy.com/app/edgardleal/require-vuejs?utm_source=github.com&utm_medium=referral&utm_content=edgardleal/require-vuejs&utm_campaign=badger)
[![Build Status](https://travis-ci.org/edgardleal/require-vuejs.svg?branch=master)](https://travis-ci.org/edgardleal/require-vuejs)
[![codecov](https://codecov.io/gh/edgardleal/require-vuejs/branch/master/graph/badge.svg)](https://codecov.io/gh/edgardleal/require-vuejs)
[![Code Climate](https://codeclimate.com/github/edgardleal/require-vuejs/badges/gpa.svg)](https://codeclimate.com/github/edgardleal/require-vuejs)
[![NPM](https://nodei.co/npm/require-vuejs.png)](https://nodei.co/npm/require-vuejs/)

This library has only 4Kb ( minified ).

## What this library can do

* Real time integration 
* Don't need build to use
* Used as RequireJS plugin 
* You can use syntax detection from your IDE
* Suport for [single file component](https://vuejs.org/v2/guide/single-file-components.html)
* Work with or without extencion
* Support .html and .vue files 
* CSS inside component file

## What this library can't do
* Parse Jade and other templates 
* Scoped css 

## CDN 
Developent ( last version )


    https://rawgit.com/edgardleal/require-vuejs/master/dist/require-vuejs.js


For production usage: ( Fast CDN, long age cache and minified )

    https://cdn.rawgit.com/edgardleal/require-vuejs/aeaff6db/dist/require-vuejs.min.js

## Instalation from [NPM repository](https://www.npmjs.com/package/require-vuejs)

`npm install require-vuejs`


## Usage 

This example on [Codepen](http://codepen.io/edgardleal/pen/XMaeNP/)

### File structure

    app.js
    component.vue
    index.html

### Source code example

index.html

```html
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
```
---

Create your component:  ( component.vue )
```html
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
```
---

Create your app code: ( app.js )
```js
    requirejs.config({
        paths: {
            "Vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.1/vue.min",
            "vue": "https://rawgit.com/edgardleal/require-vue/master/dist/require-vuejs"
        },
        shim: {
            "Vue": {"exports": "Vue"}
        }
    });
    
	// to use component in your code with RequireJS: 
	// put a reference to your component file with or without extencion after 'vue!' 
    require(["Vue", "vue!component"], function(Vue){
        var app = new Vue({
            el: "#app"
        });
    });
```

## Optimize ( r.js )

Create a build file to `r.js`. In this example we are using a file named `build.js`:

```js
    ({
        baseUrl: ".",
        paths: {
            "Vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.1/vue",
            "vue": "require-vuejs" // full path to require-vuejs library file 
        },
        name: "app",
        out: "main-built.js"
    })
```

After create the file `build.js` with your build configuration execute this command: 

```bash
    r.js -o build.js
```

## Contributing

[CONTRUBUTING](https://github.com/edgardleal/require-vuejs/blob/master/CONTRIBUTING.md)

## Licence  

[MIT](https://github.com/edgardleal/require-vuejs/blob/master/LICENSE)

## Code of Conduct  

[https://js.foundation/conduct/](https://js.foundation/conduct/)

