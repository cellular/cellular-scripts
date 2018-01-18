const resolveBin = require('resolve-bin');
const spawn = require('cross-spawn');

module.exports = (bin, args, opts = {}) =>
  spawn.sync(
    resolveBin.sync(bin),
    args,
    Object.assign({ stdio: 'inherit' }, opts)
  ).result;
