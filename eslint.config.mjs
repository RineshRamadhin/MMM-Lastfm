import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Log: "readonly",
        Module: "readonly",
        config: "readonly"
      },
      sourceType: "commonjs"
    },
    rules: {}
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.node
      },
      sourceType: "module"
    },
    rules: {}
  }
]);