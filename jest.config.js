// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  roots: ['<rooDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  coverageProvider: 'v8',
  testEnvironment: 'node',
};
