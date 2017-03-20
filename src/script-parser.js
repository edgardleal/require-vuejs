/*
 * script-parser.js
 * Copyright (C) 2017 Edgard Leal
 *
 * Distributed under terms of the MIT license.
 */
define("script-parser", [], function() {
  'use strict';
  return {
      findCloseTag: function(text, start) {
          var i = start;
          while(i < text.length && text[i++] !== ">"){}
          return i;
      },
      extractScript: function(text) {
          var start = text.indexOf("<script");
          var sizeOfStartTag = this.findCloseTag(text, start);
          var end = text.indexOf("</script>");
          return text.substring(sizeOfStartTag, end);
      }
  };
});
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */
