module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],

  "env": {
    "node": true
  },

  "overrides": [
    {
      "files": ["ruby-magic.js"],
      "rules": {
        "no-extend-native": "off"
      }
    },
    {
      "files": ["jobhandler.js"],
      "rules": {
        "no-console": "off",
        "consistent-return": "off",
      }
    },
    {
      "files": ["src/**"],
      "rules": {
        "no-console": "off",
        "no-use-before-define": "off",
        "no-confusing-arrow": ["error", {"allowParens": true}],
        "prefer-destructuring": "off",
      }
    },
    {
      "files": ["*.spec.js"],
      "rules": {
        "no-use-before-define": "off",
        "prefer-destructuring": "off",
        "no-underscore-dangle": "off"
      },
      "env": {
        "mocha": true,
      }
    }
  ]
};