module.exports = env => {
  const config = require('../../../webpack')(env);
  config.output.filename = 'custom.js';
  return config;
};
