module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@yurbajs/(.*)$': '<rootDir>/../$1/src'
  },
  transform: {
    '^.+\.ts$': ['ts-jest', {
      useESM: false
    }]
  }
};