// @flow

const spawn = require('../lib/spawn');
const app = require('../lib/app');

module.exports = function() {
  const args = ['--env.prod'];
  if (!app.hasFile('webpack.config.js')) {
    args.push('--config', require.resolve('../webpack'));
  }
  return spawn('webpack', args);
};
