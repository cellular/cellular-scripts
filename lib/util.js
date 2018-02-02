const fs = require('fs');

function fileContains(file, value) {
  if (!fs.existsSync(file)) return false;
  const content = fs.readFileSync(file, 'utf8');
  return content.search(value) >= 0;
}

module.exports = {
  fileContains,
};
