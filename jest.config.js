module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@query-to-query/(.*)$': '<rootDir>/packages/$1/src',
  },
  testMatch: ['**/tests/**/*.test.ts'],
};
