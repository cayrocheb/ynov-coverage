const {createDefaultPreset} = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },
    testMatch: ["<rootDir>/test/**/*.spec.ts"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["html", "lcov", ["text", {file: "coverage.txt"}]],
    collectCoverageFrom: ["src/**/*.ts"],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    }
};
