const git = require('git-rev-sync');
const { customize, hasFile, root } = require('./app');

module.exports = Object.assign({}, customize('env', {}), {
  NODE_ENV: process.env.NODE_ENV || 'development',
  GIT_REV: hasFile('.git') ? git.short(root) : `snapshot-${Date.now()}`
});
