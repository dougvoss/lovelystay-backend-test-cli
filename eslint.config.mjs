import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/*.config.js", "node_modules/**", "dist/**"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      indent: ["error", 2],
      "max-len": ["error", { code: 80 }],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
