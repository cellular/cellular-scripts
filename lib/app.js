const fs = require('fs');
const path = require('path');
const readPkgUp = require('read-pkg-up');
const arrify = require('arrify');
const has = require('lodash.has');

const { path: packageJson, pkg } = readPkgUp.sync();
const root = path.dirname(packageJson);
const resolve = path.resolve.bind(null, root);

const hasFile = f => fs.existsSync(path.resolve(root, f));
const hasPkgProp = props => arrify(props).some(prop => has(pkg, prop));

const hasPkgSubProp = pkgProp => props =>
  hasPkgProp(arrify(props).map(p => `${pkgProp}.${p}`));

const hasDep = hasPkgSubProp('dependencies');
const hasDevDep = hasPkgSubProp('devDependencies');
const hasPeerDep = hasPkgSubProp('peerDependencies');
const hasScript = hasPkgSubProp('scripts');
const hasAnyDep = (...args) =>
  [hasDep, hasDevDep, hasPeerDep].some(fn => fn(...args));

const cellularConfig = resolve('cellular.config.js');
const cellular = fs.existsSync(cellularConfig) ? require(cellularConfig) : null;

function customize(key, config) {
  let newConfig = cellular && cellular[key];
  if (typeof newConfig == 'function') {
    newConfig = newConfig(config);
  }
  return newConfig || config;
}

const relative = customize('paths', {
  output: 'public',
  html: 'static/index.html',
  entry: 'src/index.js',
  src: 'src',
  static: 'static',
  rootUrl: '/'
});

module.exports = {
  root,
  customize,
  output: resolve(relative.output),
  html: resolve(relative.html),
  entry: resolve(relative.entry),
  src: resolve(relative.src),
  static: resolve(relative.static),
  outputHtml: resolve(relative.output, 'index.html'),
  nodeModules: resolve('node_modules'),
  rootUrl: relative.rootUrl,
  pkg,
  hasDep,
  hasDevDep,
  hasPeerDep,
  hasAnyDep,
  hasScript,
  hasPkgProp,
  hasFile
};
