module.exports = {
    "extends": [
        "airbnb-base"
    ],
    "plugins": [
        "import"
    ],
    "env": {
        "browser": true
    },
    "globals": {
        "angular": true,
        "BUILD": true
    },
    "rules": {
        "global-require": "off",
        "indent": ["error", 4, {
            "SwitchCase": 1,
            "VariableDeclarator": 1,
            "outerIIFEBody": 1,
            "FunctionDeclaration": {
                "parameters": 1,
                "body": 1
            },
            "FunctionExpression": {
                "parameters": 1,
                "body": 1
            }
        }],
        "space-before-function-paren": ["error", { "anonymous": "always", "named": "always" }],
        "no-param-reassign": ["error", { "props": false }],
        "no-unused-vars": "off",
        "no-use-before-define": ["error", { "functions": false }]
    }
};