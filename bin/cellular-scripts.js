#!/usr/bin/env node

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const [name, ...args] = process.argv.slice(2);
let script;

try {
  script = require(`../scripts/${name}`);
} catch (err) {
  console.log('No such script: ', name);
  process.exit(1);
}

Promise.resolve(script(...args))
  .then(result => {
    if (typeof result == 'number') process.exitCode = result;
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
