// @flow

const { hasDep, hasDevDep } = require('../lib/app');

const isNode = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'test';

const webpackOpts = {
  modules: false
};

const nodeOpts = {
  targets: {
    node: 'current'
  }
};

const envOptions = isNode ? nodeOpts : webpackOpts;

const presets = [
  [require.resolve('babel-preset-env'), envOptions],
  hasDevDep('flow-bin') && require.resolve('babel-preset-flow'),
  hasDep('react', 'preact') && require.resolve('babel-preset-react')
].filter(Boolean);

const plugins = [
  require.resolve('babel-plugin-syntax-dynamic-import'),
  require.resolve('babel-plugin-transform-decorators-legacy'),
  require.resolve('babel-plugin-transform-class-properties'),
  require.resolve('babel-plugin-transform-object-rest-spread'),
  require.resolve('babel-plugin-minify-dead-code-elimination'),
  hasDep('glamorous') && require.resolve('babel-plugin-glamorous-displayname'),
  isNode && require.resolve('babel-plugin-dynamic-import-node')
].filter(Boolean);

module.exports = {
  presets,
  plugins
};
