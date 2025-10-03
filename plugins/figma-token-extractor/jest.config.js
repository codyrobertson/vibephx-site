module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/transformer.class.js'
  ],
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}
