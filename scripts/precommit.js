// @flow

const spawn = require('../lib/spawn');
const { hasPkgProp, hasFile } = require('../lib/app');

module.exports = function() {
  const useBuiltinConfig =
    !hasFile('.lintstagedrc') &&
    !hasFile('lint-staged.config.js') &&
    !hasPkgProp('lint-staged');

  const args = useBuiltinConfig ? [require.resolve('../lintstaged')] : [];
  return spawn('lint-staged', args);
};
