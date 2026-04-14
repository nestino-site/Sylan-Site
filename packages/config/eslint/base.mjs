import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/** Shared baseline; apps extend with `parserOptions.project` for type-aware rules. */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  }
);
