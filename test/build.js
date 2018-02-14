const fs = require('fs-extra');
const path = require('path');
const cp = require('child_process');

const node = process.argv[0];
const bin = require.resolve('../bin/cellular-scripts');

test('builtin config', () => {
  const appPath = path.join(__dirname, 'fixture', 'builtins');
  const distPath = path.join(appPath, 'dist');
  const manifestPath = path.join(distPath, 'asset-manifest.json');
  process.chdir(appPath);
  fs.removeSync(distPath);
  const result = cp.spawnSync(node, [bin, 'build'], {
    env: Object.assign({}, process.env, {
      INIT_CWD: appPath,
    }),
  });
  expect(result.status).toEqual(0);
  expect(fs.existsSync(manifestPath)).toBeTruthy();
  const mainPath = path.join(distPath, require(manifestPath)['main.js']);
  const main = fs.readFileSync(mainPath, 'utf8');
  expect(main).toContain('React.createElement("h1"');
  fs.removeSync(distPath);
});

test('custom config', () => {
  const appPath = path.join(__dirname, 'fixture', 'custom');
  const distPath = path.join(appPath, 'dist');
  const manifestPath = path.join(distPath, 'asset-manifest.json');
  process.chdir(appPath);
  fs.removeSync(distPath);
  const result = cp.spawnSync(node, [bin, 'build'], {
    env: Object.assign({}, process.env, {
      INIT_CWD: appPath,
    }),
  });
  expect(result.status).toEqual(0);
  expect(fs.existsSync(manifestPath)).toBeTruthy();
  const mainPath = path.join(distPath, require(manifestPath)['main.js']);
  expect(mainPath).toContain('custom.js');
  const main = fs.readFileSync(mainPath, 'utf8');
  expect(main).toContain('React.createElement("h1"');
  fs.removeSync(distPath);
});
