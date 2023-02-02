module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:react-hooks/recommended",
    // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
    // Make sure it's always the last config, so it gets the chance to override other configs.
    "eslint-config-prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "sort-keys"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "arrow-body-style": ["error", "as-needed"],
    "import/named": "off",
    "import/no-unresolved": "off",
    "jsx-a11y/accessible-emoji": "off",
    "react/display-name": "off",
    // allow jsx syntax in js files (for next.js project)
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".tsx", ".ts"] },
    ], //should add ".ts" if typescript project
    // "object-curly-newline": ["error", { minProperties: 0 }],
    // "object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
    "react/jsx-first-prop-new-line": ["error", "multiline"],
    "react/no-unescaped-entities": "off",
    "react/prop-types": "off",
    // suppress errors for missing 'import React' in files
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": 0,
    "react/self-closing-comp": ["error", { component: true, html: true }],
    "sort-keys": 0,
    "sort-keys/sort-keys-fix": 1,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
