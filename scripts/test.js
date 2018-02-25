// @flow

const { hasPkgProp, hasFile } = require('about-this-app');

module.exports = function(...args /*: string[] */) {
  process.env.BABEL_ENV = 'test';
  process.env.NODE_ENV = 'test';

  const watch =
    !process.env.CI &&
    !process.env.SCRIPTS_PRECOMMIT &&
    !args.includes('--no-watch') &&
    !args.includes('--coverage') &&
    !args.includes('--updateSnapshot')
      ? ['--watch']
      : [];

  const config =
    !args.includes('-c') &&
    !args.includes('--config') &&
    !hasFile('jest.config.js') &&
    !hasPkgProp('jest')
      ? ['--config', JSON.stringify(require('../jest'))]
      : [];

  require('jest').run(config.concat(watch, args));
};
