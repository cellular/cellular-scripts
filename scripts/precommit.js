// @flow

const { lintStaged } = require('cellular-lint');

module.exports = function(...args /*: string[] */) {
  return lintStaged(args);
};
