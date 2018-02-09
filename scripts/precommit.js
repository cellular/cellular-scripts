// @flow

const { hasPkgProp, hasFile } = require('about-this-app');
const spawn = require('../lib/spawn');

module.exports = function() {
  const useBuiltinConfig =
    !hasFile('.lintstagedrc') &&
    !hasFile('lint-staged.config.js') &&
    !hasPkgProp('lint-staged');

  const args = useBuiltinConfig ? [require.resolve('../lintstaged')] : [];
  return spawn('lint-staged', args);
};
