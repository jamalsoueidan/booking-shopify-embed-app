const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  globalSetup: "./jest/setup",
  globalTeardown: "./jest/teardown.js",
  testEnvironment: "./jest/mongo-environment.js",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  roots: ["<rootDir>"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  preset: "ts-jest",
  testMatch: ["**/?(*.)+(spec|test).[t]s?(x)"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
};
