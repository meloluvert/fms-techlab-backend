const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  rootDir: "./src", // raiz do código
  testMatch: ["**/tests/**/*.test.ts"], // pega todos os testes em src/tests/**/
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
