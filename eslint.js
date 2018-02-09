// @flow

const { hasFile, hasPkgProp, pkg } = require('about-this-app');

const presets = ['cellular'];

const hasPrettierRc =
  hasFile('.prettierrc') ||
  hasFile('.prettier.config.js') ||
  hasPkgProp('prettier');

if (hasPrettierRc) presets.push('cellular/prettierrc');

module.exports = {
  extends: presets,
  settings: {
    react: {
      flowVersion: pkg.devDependencies['flow-bin'],
    },
  },
};
