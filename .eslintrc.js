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
      "files": ["src/jobhandler.js"],
      "rules": {
        "no-console": "off",
        "consistent-return": "off",
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