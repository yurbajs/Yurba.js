module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@yurbajs/types$': '<rootDir>/../types/dist/index',
    '^@yurbajs/(.*)$': '<rootDir>/../$1/dist/index'
  },
  transform: {
    '^.+\.ts$': ['ts-jest', {
      useESM: false
    }]
  }
};