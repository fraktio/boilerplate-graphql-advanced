// eslint-disable-next-line no-restricted-syntax
export default {
  roots: ["<rootDir>"],
  preset: "ts-jest",
  globalSetup: "<rootDir>/app/tests/globalSetup.ts",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/app/$1",
  },

  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
};
