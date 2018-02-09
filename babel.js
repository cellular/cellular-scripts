// @flow

const { hasDep, hasDevDep } = require('./lib/app');

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
