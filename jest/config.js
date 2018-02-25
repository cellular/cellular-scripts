// @flow

const { hasFile, hasPkgProp, dir } = require('about-this-app');

const useBuiltInBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel');

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__',
];

const config = {
  roots: [dir('src')],
  collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
  testMatch: [
    '**/__tests__/**/*.{js,jsx,mjs}',
    '**/?(*.)(spec|test).{js,jsx,mjs}',
  ],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
  transform: useBuiltInBabelConfig
    ? {
        '^.+\\.(js|jsx|mjs)$': require.resolve('./babelTransform'),
        '^(?!.*\\.(js|jsx|mjs|json)$)': require.resolve('./fileTransform.js'),
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
