// @flow

const app = require('about-this-app');
const spawn = require('spawn-bin');

module.exports = function(...args /*: string[] */) {
  const cliArgs = [...args, '--mode', 'production'];
  if (!app.hasFile('webpack.config.js')) {
    cliArgs.push('--config', require.resolve('../webpack'));
  }
  return spawn('webpack', cliArgs).status;
};
