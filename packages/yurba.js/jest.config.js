module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@yurbajs/(.*)$': '<rootDir>/../$1/lib'
  },
  transform: {
    '^.+\.ts$': ['ts-jest', {
      useESM: false
    }]
  }
};