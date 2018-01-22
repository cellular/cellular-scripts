const path = require('path');
const portfinder = require('portfinder');
const request = require('request-promise-native');
const spawn = require('cross-spawn');

const bin = require.resolve('../bin/cellular-scripts');

test(
  'start',
  () => {
    const appPath = path.join(__dirname, 'fixture', 'builtins');
    process.chdir(appPath);
    return portfinder.getPortPromise().then(port => {
      return new Promise((resolve, reject) => {
        const child = spawn(bin, ['start', '--port', port], {
          stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
          detached: true,
        });
        child.on('error', reject);
        child.stdout.once('data', () => {
          request(`http://localhost:${port}`)
            .then(res => {
              process.kill(-child.pid);
              expect(res).toMatch(/<div id="root">/);
              resolve();
            })
            .catch(err => {
              process.kill(-child.pid);
              reject(err);
            });
        });
      });
    });
  },
  60000
);
