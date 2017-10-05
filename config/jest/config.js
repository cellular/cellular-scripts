const { customize, hasFile, hasPkgProp, src } = require('../../lib/app');

const useBuiltInBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel');

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__'
];

const config = {
  roots: [src],
  //testEnvironment: 'jsdom',
  //collectCoverageFrom: ['src/**/*.js'],
  //testMatch: ['**/__tests__/**/*.js'],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};

if (useBuiltInBabelConfig) {
  config.transform = {
    '^.+\\.js$': require.resolve('./babelTransform')
  };
}

module.exports = customize('jest', config);
