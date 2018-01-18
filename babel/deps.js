// @flow

const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'test';
const isWebpack = !isTest;

const envModules = isWebpack ? { modules: false } : {};
const envTargets = isTest ? { node: 'current' } : { browsers: ['> 2%'] };

const envOptions = Object.assign({}, envModules, { targets: envTargets });

const presets = [[require.resolve('babel-preset-env'), envOptions]];

module.exports = {
  presets
};
