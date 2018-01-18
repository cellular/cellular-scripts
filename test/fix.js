const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const bin = require.resolve('../bin/cellular-scripts');

test('build', () => {
  const appPath = path.join(__dirname, 'fixture');
  const fixable = path.join(appPath, 'src', 'fixable.js');
  fs.outputFileSync(fixable, ' console.log( "hello world" )');
  process.chdir(appPath);
  const result = spawn.sync(bin, ['fix']);
  expect(result.status).toEqual(0);
  const fixed = fs.readFileSync(fixable, 'utf8');
  fs.removeSync(fixable);
  expect(fixed).toEqual("console.log('hello world');\n");
});
