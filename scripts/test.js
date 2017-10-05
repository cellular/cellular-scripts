const { hasPkgProp, hasFile } = require('../lib/app');

module.exports = function(...args) {
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

  // Populate the require cache to allow cellular-scripts to be used as jest preset
  const jestConfig = require('../config/jest');
  const jestPreset = require.resolve('../jest-preset.json');
  require.cache[jestPreset] = { exports: jestConfig };

  const config =
    !args.includes('-c') &&
    !args.includes('--config') &&
    !hasFile('jest.config.js') &&
    !hasPkgProp('jest')
      ? ['--config', JSON.stringify(jestConfig)]
      : [];

  require('jest').run(config.concat(watch, args));
};
