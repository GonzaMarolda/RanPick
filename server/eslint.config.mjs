import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"], 
    languageOptions: {
      sourceType: "commonjs"
    },
    extends: ["eslint:recommended"],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
  {
    languageOptions: { 
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
];