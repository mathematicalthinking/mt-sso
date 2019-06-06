module.exports = {
  "env": {
    "node": true,
    "es6": true,
},
  extends: [
    "eslint:recommended",
    'plugin:prettier/recommended',
  ], // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  "parserOptions": {
    "ecmaVersion": 2017
},
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "no-unused-vars": "warn",
    "no-console": "off",
  },
};
