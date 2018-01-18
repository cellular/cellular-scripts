// @flow

const lint = require('./lint');

module.exports = function(...args /*: string[] */) {
  return lint('--fix', ...args);
};
