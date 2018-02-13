console.log(`
** DEPRECATION WARNING **

The "cellular-scripts/eslint" config is no longer supported.
Please update your .eslintrc file and use extends: ["cellular"] instead.
`);

module.exports = {
  extends: ['cellular'],
};
