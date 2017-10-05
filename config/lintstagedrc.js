const cellularScripts = require.resolve('../bin/cellular-scripts');

module.exports = {
  linters: {
    '**/*.+(js|json)': [`${cellularScripts} fix`, 'git add']
  }
};
