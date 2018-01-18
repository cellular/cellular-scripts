const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');

const bin = require.resolve('../bin/cellular-scripts');

test('builtin config', () => {
  const appPath = path.join(__dirname, 'fixture', 'builtins');
  const distPath = path.join(appPath, 'dist');
  const manifestPath = path.join(distPath, 'asset-manifest.json');
  process.chdir(appPath);
  fs.removeSync(distPath);
  const result = spawn.sync(bin, ['build']);
  expect(result.status).toEqual(0);
  expect(fs.existsSync(manifestPath)).toBeTruthy();
  fs.removeSync(distPath);
});

test('custom config', () => {
  const appPath = path.join(__dirname, 'fixture', 'custom');
  const distPath = path.join(appPath, 'dist');
  const bundlePath = path.join(distPath, 'custom.js');
  process.chdir(appPath);
  fs.removeSync(distPath);
  const result = spawn.sync(bin, ['build']);
  expect(result.status).toEqual(0);
  expect(fs.existsSync(bundlePath)).toBeTruthy();
  fs.removeSync(distPath);
});
