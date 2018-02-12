// @flow

const { lint } = require('cellular-lint');

module.exports = function(...args /*: string[] */) {
  return lint(args);
};
