// @flow

const { hasFile, hasPkgProp, src } = require('../lib/app');

const useBuiltInBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel');

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__',
];

const config = {
  roots: [src],
  //testEnvironment: 'jsdom',
  //collectCoverageFrom: ['src/**/*.js'],
  //testMatch: ['**/__tests__/**/*.js'],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  transform: useBuiltInBabelConfig
    ? {
        '^.+\\.js$': require.resolve('./babelTransform'),
      }
    : {},
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

module.exports = config;
