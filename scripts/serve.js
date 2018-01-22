// @flow

const spawn = require('../lib/spawn');

module.exports = function(...args /*: string[] */) {
  const app = require('../lib/app');
  const useBuiltInConfig = !app.hasFile('webpack.config.js');
  const cliArgs = [...args, '--env.prod'];
  if (useBuiltInConfig) cliArgs.push('--config', require.resolve('../webpack'));

  return spawn('webpack-dev-server', cliArgs, {
    env: Object.assign({}, process.env, {
      BABEL_ENV: 'production',
      NODE_ENV: 'production',
    }),
  });
};
