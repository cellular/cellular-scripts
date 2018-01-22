// @flow

const spawn = require('../lib/spawn');
const { hasPkgProp, hasFile } = require('../lib/app');

module.exports = function(...args /*: string[] */) {
  const useBuiltinConfig =
    !args.includes('--config') &&
    !hasFile('.eslintrc') &&
    !hasFile('.eslintrc.js') &&
    !hasPkgProp('eslintConfig');

  const config = useBuiltinConfig
    ? ['--config', require.resolve('../eslint')]
    : [];

  const useBuiltinIgnore =
    !args.includes('--ignore-pattern') &&
    !hasFile('.eslintignore') &&
    !hasPkgProp('eslintIgnore');

  const ignore = useBuiltinIgnore
    ? [
        '--ignore-pattern',
        'node_modules',
        '--ignore-pattern',
        'public',
        '--ignore-pattern',
        'dist',
        '--ignore-pattern',
        'flow-typed',
        '--ignore-pattern',
        'coverage',
        '--ignore-pattern',
        '.next',
      ]
    : [];

  const filesGiven = args.some(arg => arg.includes('.js'));
  const files = filesGiven ? [] : ['.'];

  return spawn('eslint', [...config, ...ignore, ...args, ...files]);
};
