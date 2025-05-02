import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  {
    files: ["lib/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: { ...globals.node }
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off"
    }
  }
]);
