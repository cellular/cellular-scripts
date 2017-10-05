const { customize, hasDep, hasDevDep } = require('../lib/app');

const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'test';
const isWebpack = !isTest;

const envModules = isWebpack ? { modules: false } : {};
const envTargets = isTest ? { node: 'current' } : { browsers: ['> 2%'] };

const envOptions = Object.assign({}, envModules, { targets: envTargets });

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
  !isWebpack && require.resolve('babel-plugin-dynamic-import-node')
].filter(Boolean);

module.exports = customize('babel', {
  presets,
  plugins
});
