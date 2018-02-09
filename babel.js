// @flow

const { hasDep, hasDevDep } = require('about-this-app');

module.exports = {
  presets: [
    [
      'cellular',
      {
        flow: hasDevDep('flow-bin'),
        react: hasDep('react', 'preact'),
        glamorous: hasDep('glamorous'),
      },
    ],
  ],
};
