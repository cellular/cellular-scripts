// @flow

const fs = require('fs');
const path = require('path');
const readPkgUp = require('read-pkg-up');
const git = require('git-rev-sync');
const arrify = require('arrify');
const _ = require('lodash');

const { path: packageJson, pkg } = readPkgUp.sync();
const root = path.dirname(packageJson);
const resolve = path.resolve.bind(null, root);

const hasFile = (f /*: string */) => fs.existsSync(resolve(f));
const hasPkgProp = props => arrify(props).some(prop => _.has(pkg, prop));

const hasPkgSubProp = (pkgProp /*: string */) => (...props /*: string[] */) =>
  hasPkgProp(arrify(props).map(p => `${pkgProp}.${p}`));

const hasDep = hasPkgSubProp('dependencies');
const hasDevDep = hasPkgSubProp('devDependencies');
const hasPeerDep = hasPkgSubProp('peerDependencies');
const hasScript = hasPkgSubProp('scripts');
const hasAnyDep = (...args /*: string[] */) =>
  [hasDep, hasDevDep, hasPeerDep].some(fn => fn(...args));

const revision = hasFile('.git') ? git.short(root) : `snapshot-${Date.now()}`;

const { directories = {} } = pkg;

const dirs = {
  dist: directories.dist || 'dist',
  src: directories.src || 'src',
  static: directories.static || 'static',
};

const dist = resolve(dirs.dist);
const main = pkg.main ? path.relative(dist, resolve(pkg.main)) : null;

module.exports = {
  root,
  dirs,
  dist,
  src: resolve(dirs.src),
  static: resolve(dirs.static),
  nodeModules: resolve('node_modules'),
  main,
  revision,
  pkg,
  hasDep,
  hasDevDep,
  hasPeerDep,
  hasAnyDep,
  hasScript,
  hasPkgProp,
  hasFile,
};
