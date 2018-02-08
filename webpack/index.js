// @flow

const dev = require('./dev');
const prod = require('./prod');
const { expression } = require('./env');

/*::
type env = {
  prod?: boolean
};
*/

module.exports = exports = (env /*: ?env */) => {
  const isProd = env && env.prod;
  const config = isProd ? prod : dev;
  return config(env);
};

exports.expression = expression;
