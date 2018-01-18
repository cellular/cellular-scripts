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
    !args.includes('--ignore-path') &&
    !hasFile('.eslintignore') &&
    !hasPkgProp('eslintIgnore');

  const ignore = useBuiltinIgnore
    ? ['--ignore-path', require.resolve('../eslintignore')]
    : [];

  const filesGiven = args.some(arg => arg.includes('.js'));
  const files = filesGiven ? [] : ['.'];

  return spawn('eslint', [...config, ...ignore, ...args, ...files]);
};
