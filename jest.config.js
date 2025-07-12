module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!(marked)/)"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "tsconfig.jest.json",
    },
  },
};
