// @flow

const isNode = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'test';

const webpackOpts = {
  modules: false,
};

const nodeOpts = {
  targets: {
    node: 'current',
  },
};

const envOptions = isNode ? nodeOpts : webpackOpts;
const presets = [[require.resolve('babel-preset-env'), envOptions]];

module.exports = {
  presets,
};
