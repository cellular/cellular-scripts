module.exports = function() {
  const eslint = require('eslint/lib/cli');
  return eslint.execute(process.argv.slice(0, 2).concat('src'));
};
