var path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  globals: {
    'ts-jest': {
      tsconfig: path.resolve('./tsconfig.json').compilerOptions
    }
  },
  transform: {
    "^.+\\.(ts|tsx|js)$": "ts-jest"
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$"
  ],
  modulePathIgnorePatterns: [
    "(?:integration.test.tsx)"
  ],
  roots: [
    path.resolve('./src')
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
}