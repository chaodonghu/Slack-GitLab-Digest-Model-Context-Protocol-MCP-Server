module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["eslint-comments", "jsx-a11y", "prettier", "react", "react-hooks"],
  env: {
    node: true,
    browser: true,
    commonjs: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:eslint-comments/recommended",
    "turbo",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": ["off"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", ignoreRestSiblings: true },
    ],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-non-null-assertion": ["off"],
    "@typescript-eslint/ban-ts-comment": ["off"],
    "react/prop-types": ["off"],
    "prettier/prettier": "error",
    "react/no-unknown-property": ["error", { ignore: ["css"] }],
    // These should be errors, but set to "warn" due to existing code not meeting these rules.
    "eslint-comments/disable-enable-pair": ["warn"],
    "eslint-comments/no-unlimited-disable": ["warn"],
    "react/no-unescaped-entities": ["warn"],
    "@typescript-eslint/ban-types": ["warn"],
    "vitest/max-nested-describe": ["error", { "max": 3 }]
  },
  overrides: [
    // Auto-generated type definitions
    {
      files: [
        "src/graphql-types.ts",
        "**/types/*.js",
        "**/types/*.ts",
        "**/__generated__/*",
      ],
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "eslint-comments/no-restricted-disable": "off",
        "eslint-comments/disable-enable-pair": "off",
        "plugin:vitest/recommended": "error",
      },
    },
    {
      files: ["*.test.ts", "*.test.tsx", "vitest.config.ts"],
      env: { jasmine: true },
      plugins: ['vitest'],
    },
  ],
};
