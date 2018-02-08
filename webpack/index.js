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

module.exports = exports = (env /*: ?env */, overrides /*: ?Object */) => {
  const isProd = env && env.prod;
  const config = isProd ? prod : dev;
  return _.merge({}, config(env), overrides);
};

exports.expression = expression;
