// @flow

const fs = require('fs');

function fileContains(file /*: string */, value /*: string | RegExp */) {
  if (!fs.existsSync(file)) return false;
  const content = fs.readFileSync(file, 'utf8');
  return content.search(value) >= 0;
}

module.exports = {
  fileContains,
};
