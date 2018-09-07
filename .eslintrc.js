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
      "files": ["src/jobhandler.js"],
      "rules": {
        "no-console": "off",
        "consistent-return": "off",
      }
    },
    {
      "files": ["src/**"],
      "rules": {
        "no-console": "off",
        "no-use-before-define": "off"
      }
    },
    {
      "files": ["*.spec.js"],
      "rules": {
        "prefer-destructuring": "off"
      },
      "env": {
        "mocha": true,
      }
    }
  ]
};