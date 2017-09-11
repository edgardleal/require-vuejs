module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "plugins": [
        "vue"
    ],
    "globals": {
        "require": true,
        "requirejs": true,
        "define": true,
        "template": true,
    },
    "extends": [
        "eslint:recommended",
    ],
    "globals": {
        "require": true,
        "define": true
    },
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
    }
};
