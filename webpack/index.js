// @flow

const _ = require('lodash');
const dev = require('./dev');
const prod = require('./prod');
const { expression } = require('./env');

/*::
type env = {
  prod?: boolean
};
*/

function config(env /*: ?env */) {
  const isProd = env && env.prod;
  const config = isProd ? prod : dev;
  return config(env);
}

module.exports = exports = config;

exports.merge = function(env /*: env */, overrides /*: Object */) {
  return _.merge(config(env), overrides);
};

exports.expression = expression;
