const _ = require('lodash');
const dev = require('./dev');
const prod = require('./prod');
const { expression } = require('./env');

function config(env, argv) {
  const isProd = argv.mode == 'production';
  const config = isProd ? prod : dev;
  return config(env, argv);
}

module.exports = exports = config;

exports.merge = function(env, argv, overrides) {
  if (!overrides) throw new Error('merge requires three arguments');
  return _.merge(config(env, argv), overrides);
};

exports.override = function(overrides) {
  return (env, argv) => exports.merge(env, argv, overrides);
};

exports.expression = expression;
