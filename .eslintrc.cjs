module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  rules: {
    "jsdoc/no-types": "error",
  },
  ignorePatterns: ["build", ".eslintrc.cjs", "*.d.ts"],
  parser: "@typescript-eslint/parser",
  plugins: ["jsdoc", "@typescript-eslint"],
};
