module.exports = function() {
  const install = require('install-deps-postmerge');
  return install().then(updated => {
    console.log(updated ? 'Dependencies updated.' : 'No new dependencies.');
  });
};
