# require-vue
RequireJS plugin to async and dynamic load and parse .vue components 

This library has only 8Kb.

## CDN 
Developent ( last version )

`
    https://rawgit.com/edgardleal/require-vue/master/src/require-vue.js
`

For production usage: ( Fast CDN, long age cache )

`
    https://cdn.rawgit.com/edgardleal/require-vue/49f98a03/dist/require-vue.min.js
`


## Usage 

index.html


`
    <!DOCTYPE html>
    <html lang="en">
        <body>
          <div id="app">
    			    <my-component></my-component>
        	</div>
        </body>
    </html>
`
---
Create your component:  ( component.vue )

`
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
`
---
Create your app code: ( app.js )
`
    require(["Vue", "vue!component"], function(Vue) {
        var app = new Vue({
    		    el: '#app'
    		}):
    });

`

## Licence  
MIT

## Code of Conduct  

[https://js.foundation/conduct/](https://js.foundation/conduct/)

