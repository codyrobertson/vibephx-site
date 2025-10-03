module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/plugins/figma-token-extractor/tests'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
