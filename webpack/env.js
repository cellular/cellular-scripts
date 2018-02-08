// @flow

const _ = require('lodash');
const app = require('../lib/app');

const EXPRESSION = Symbol('expression');

function expression(js /*: string */) {
  const exp /*: any */ = {};
  exp[EXPRESSION] = js;
  exp.toString = () => js;
  return exp;
}

function resolveEnv(value /*: any */, name /*: string */) {
  const env = process.env[name];
  if (typeof env === 'string') return env;
  if (typeof value === 'undefined' || value === null) return null;
  return value;
}

function processEnv(rawEnv /*: ?Object */) {
  const env = Object.assign(
    {
      GIT_REV: app.revision,
    },
    rawEnv
  );

  if (env.prod) {
    env.NODE_ENV = 'production';
  }

  return {
    vars: _.mapValues(env, resolveEnv),
    define: {
      'process.env': _.mapValues(env, (v, k) => {
        if (v && v[EXPRESSION]) return v[EXPRESSION];
        return JSON.stringify(resolveEnv(v, k));
      }),
    },
  };
}

module.exports = {
  resolveEnv,
  processEnv,
  expression,
};
