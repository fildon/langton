import type { Config } from "jest";

const config: Config = {
	verbose: true,
	preset: "ts-jest",
	setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
	testEnvironment: "jsdom",
	collectCoverage: true,
	collectCoverageFrom: ["**/src/**"],
	// This is the imperative shell and will not be tested
	coveragePathIgnorePatterns: ["src/index.tsx"],
};

export default config;
