const path = require('path');
const portfinder = require('portfinder');
const request = require('request-promise-native');
const cp = require('child_process');

const node = process.argv[0];
const bin = require.resolve('../bin/cellular-scripts');

test(
  'start',
  () => {
    const appPath = path.join(__dirname, 'fixture', 'builtins');
    process.chdir(appPath);
    return portfinder.getPortPromise().then(port => {
      return new Promise((resolve, reject) => {
        const child = cp.spawn(node, [bin, 'start', '--port', port], {
          stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
          detached: true,
          env: Object.assign({}, process.env, {
            INIT_CWD: appPath,
          }),
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
