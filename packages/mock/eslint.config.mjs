import globals from "globals";
import tseslint from "typescript-eslint";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node
      },
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"]
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    },
    ignores: ["dist/**", "lib/**", "*.d.ts", "*.js.map"]
  }
);