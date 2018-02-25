// @flow

const { hasDep, hasDevDep } = require('about-this-app');

module.exports = {
  presets: [
    [
      require.resolve('babel-preset-cellular'),
      {
        flow: hasDevDep('flow-bin'),
        react: hasDep('react', 'preact'),
        glamorous: hasDep('glamorous'),
      },
    ],
  ],
};
