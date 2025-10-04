import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {
    rules: {
      'max-lines': ["error", 300],
      'max-lines-per-function': ["error", 50],
      'max-depth': ["error", 4],
      'max-nested-callbacks': ["error", 3],
      'complexity': ["error", 10],
      'max-params': ["error", 4],
      'max-statements': ["error", 30]
    }
  }
];
