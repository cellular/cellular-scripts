// @flow

const app = require('./lib/app');
const cellularScripts = require.resolve('./bin/cellular-scripts');

const fix = `${cellularScripts} lint --fix`;
const flow = app.hasAnyDep('flow-bin') && 'flow focus-check';
const stage = 'git add';

module.exports = {
  linters: {
    '**/*.+(js|mjs|json)': [fix, flow, stage].filter(Boolean)
  }
};
