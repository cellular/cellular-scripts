module.exports = (env, argv) => {
  const config = require('../../../webpack')(env, argv);
  config.output.filename = 'custom.js';
  return config;
};
