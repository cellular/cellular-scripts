// @flow

const app = require('about-this-app');
const spawn = require('spawn-bin');

module.exports = function() {
  const args = ['--env.prod'];
  if (!app.hasFile('webpack.config.js')) {
    args.push('--config', require.resolve('../webpack'));
  }
  return spawn('webpack', args).status;
};
