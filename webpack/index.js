// @flow

const dev = require('./dev');
const prod = require('./prod');
const { expression } = require('./env');

module.exports = exports = (env /*: any */) => {
  const isProd = env && env.prod;
  const config = isProd ? prod : dev;
  return config(env);
};

exports.expression = expression;
