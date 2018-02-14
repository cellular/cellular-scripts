const fs = require('fs-extra');
const path = require('path');
const cp = require('child_process');

const node = process.argv[0];
const bin = require.resolve('../bin/cellular-scripts');

test('init', () => {
  const appName = 'testapp';
  const appPath = path.join(__dirname, appName);
  const pkgPath = path.join(appPath, 'package.json');
  fs.ensureDirSync(appPath);
  fs.emptyDirSync(appPath);
  fs.writeJsonSync(pkgPath, {
    name: appName,
    version: '0.0.0',
    dependencies: {},
  });
  cp.spawnSync(node, [bin, 'init', appPath, appName]);
  expect(require(pkgPath).scripts.start).toEqual('cs start');
  expect(fs.existsSync(path.join(appPath, 'README.md'))).toBeTruthy();
  fs.removeSync(appPath);
});
