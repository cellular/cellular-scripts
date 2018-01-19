// @flow

const { hasFile, hasDep, hasDevDep, hasPkgProp, pkg } = require('./lib/app');

const useBuiltinPrettier =
  !hasFile('.prettierrc') &&
  !hasFile('.prettier.config.js') &&
  !hasPkgProp('prettier');

const prettierConfig = useBuiltinPrettier ? require('./prettier') : null;

const flow = hasDevDep('flow-bin');
const react = hasDep('react', 'preact');

const presets = [
  'eslint:recommended',
  'plugin:import/errors',
  'plugin:import/warnings',
  flow && 'plugin:flowtype/recommended',
  react && 'plugin:react/recommended',
  'prettier',
  flow && 'prettier/flowtype',
  react && 'prettier/react'
].filter(Boolean);

const plugins = [
  'import',
  'filenames',
  flow && 'flowtype',
  react && 'react',
  'prettier'
].filter(Boolean);

const settings = {};

if (react && flow) {
  settings.react = {
    flowVersion: pkg.devDependencies['flow-bin']
  };
}

const rules = {
  'prettier/prettier': ['error', prettierConfig],
  'no-console': 0,
  'no-debugger': 0,
  'react/prop-types': 0, // disable until 7.4.0 is released
  'react/jsx-no-target-blank': 0,
  'react/no-unescaped-entities': 0,
  'filenames/match-exported': 2
  // "import/order": ["error", {"newlines-between": "always"}]
};

module.exports = {
  extends: presets,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  globals: {
    process: true
  },
  plugins,
  settings,
  rules
};
