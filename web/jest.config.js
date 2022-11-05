module.exports = {
  globalSetup: "./jest/setup",
  globalTeardown: "./jest/teardown.js",
  testEnvironment: "./jest/mongo-environment.js",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  roots: ["<rootDir>/libs"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  preset: "ts-jest",
};
