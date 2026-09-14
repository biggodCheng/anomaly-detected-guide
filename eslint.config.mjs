import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // data 层 registry 签名统一为 (locale, ...)，单语实现暂不用 locale——
    // 下划线前缀即"有意未用"，不当警告淹没新信号
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".claude/**",   // agent worktree 等 agent 临时产物不应进 lint
      "coverage/**",
      ".turbo/**",
    ],
  },
];

export default eslintConfig;
