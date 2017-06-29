module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    "overrides": [
      {
        "files": [ "src/*.js", "example/*.js" ],
        "excludedFiles": ["dist/*.js", "example/require-vuejs.js"],
      }
    ]    
};
