const lintStaged = require('lint-staged/src');
const { hasPkgProp, hasFile } = require('../lib/app');

module.exports = function() {
  const useBuiltinConfig =
    !hasFile('.lintstagedrc') &&
    !hasFile('lint-staged.config.js') &&
    !hasPkgProp('lint-staged');

  const config = require.resolve('../config/lintstagedrc');
  lintStaged(console, useBuiltinConfig && config);
};
