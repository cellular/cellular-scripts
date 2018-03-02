[![Build Status](https://travis-ci.org/cellular/cellular-scripts.svg?branch=master)](https://travis-ci.org/cellular/cellular-scripts)
[![Greenkeeper badge](https://badges.greenkeeper.io/cellular/cellular-scripts.svg)](https://greenkeeper.io/)
[![version](https://img.shields.io/npm/v/cellular-scripts.svg)](http://npm.im/cellular-scripts)

This is a drop-in replacement for react-scripts that allows you to optionally provide custom configurations for webpack, Babel, ESLint, prettier, lint-staged and Jest.

# Setup

## Quickstart

You can bootstrap new projects via [create-react-app](https://github.com/facebookincubator/create-react-app):

```
npx create-react-app --scripts-version cellular-scripts myapp
cd myapp
npm start
```

## Existing projects

For existing projects run `npm i -D cellular-scripts`, remove all the devDependencies that are already provided by `cellular-scripts` and modify the scripts section of your package.json:

```json
{
    "scripts": {
        "start": "cs start",
        "build": "cs build",
        "serve": "cs serve",
        "test": "cs test",
        "lint": "cs lint",
        "precommit": "cs precommit",
        "postmerge": "cs postmerge"
    }
}
```

__Note__: The `precommit` and `postmerge` npm-scripts are Git-hooks that will be run by [husky](https://github.com/typicode/husky).

Modify your [webpack](#webpack), [Babel](#babel) and [ESLint](#eslint) config files to extend the settings that come with `cellular-scripts` or remove your config files altogether if the defaults work for your project.

# CLI

The `cellular-scripts` package provides a binary called `cs` that takes the name of a script as first argument:

* `cs start [options]`
  Starts a development server. Options are passed to [webpack-dev-server](https://webpack.js.org/configuration/dev-server/).
* `cs build [options]` Creates a production build. Options are passed to [webpack](https://webpack.js.org/api/cli/).
* `cs serve` Serves a previously built production version. Same options as `start`.
* `cs test [options]` Runs the test. Options are passed on to [Jest](https://facebook.github.io/jest/docs/en/cli.html)
* `cs lint [options]` Runs the linter. Options are passed to [ESLint](https://eslint.org/docs/user-guide/command-line-interface).
* `cs precommit` Runs [lint-staged](#lint-staged).
* `cs postmerge` Runs [install-deps-postmerge](https://github.com/camacho/install-deps-postmerge).

When run via npm use `--` to pass options on to the script:

```
npm start -- --port 8080 --open
```


# Configuration

## Directories

The directory layout can be customized via your project's package.json:

```json
{
    "directories": {
        "src": "src",
        "dist": "dist",
        "static": "static",
        "template": "static"
    }
}
```

* `src` where the source files are located. `src/index.js` is the default webpack entry.
* `dist` where webpack will place the output of production builds.
* `static` files that will be [copied](https://www.npmjs.com/package/copy-webpack-plugin) to `dist` verbatim.
* `template` directory containing an `index.html` that will be processed by the [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/).

## Webpack

You can provide a custom webpack configuration by placing a `webpack.config.js` file in your project's root directory.

You can modify the default configuration like this:

```js
const webpackConfig = require('cellular-scripts/webpack');

module.exports = function(env, argv) {
    const config = webpackConfig(env, argv);
    // modify default config and return it
    return config;
}
```

You can pass additional environment entries
which will be exposed via the webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

```js
module.exports = function(env, argv) {
    return webpackConfig({
        ...env,
        FOO: null, // will be set to process.env.FOO
        BAR: 'bar', // defaults to 'bar'
    }, argv);
});
```

Both values can be overwritten by setting environment variables.

## Babel

Under the hood [babel-preset-cellular](https://www.npmjs.com/package/babel-preset-cellular) is used to transpile the source code.

Files under `node_modules` are run through Babel too, but with a much simpler configuration that only applies `babel-preset-env`.

### Custom Babel Configuration

You can override the default configuration by placing a `.babelrc` file in your project's root or by adding a `babel` property to `package.json`.

To extend the default config, add it as a preset:

```json
{
    "presets": ["cellular-scripts/babel"]
}
```

## ESLint

You can override the default configuration by placing a `.eslintrc.js` file in your project's root or by adding a `eslintConfig` property to `package.json`.

The presence of such a file will also allow IDEs to pick up your configuration, which is why our `create-react-app` template will create the following `.eslintrc.js`:

```js
module.exports = {
  extends: ['cellular']
};
```

__NOTE:__ The default config won't work if `cellular-scripts` are npm-linked or installed with an older npm version that doesn't flatten the dependency tree. See this [GitHub issue](https://github.com/eslint/eslint/issues/3458) for details.

## Prettier

You can override the default configuration by placing a `.prettierrc` or `.prettier.config.js` file in your project's root or by adding a `prettier` property to `package.json`.

The default configuration is:

```json
{ 
    "singleQuote": true,
    "trailingComma": "es5"
}
```

## lint-staged

By default lint-staged will run `cs lint --fix` and optionally `flow focused-check` (if flow-bin is a dependency) followed by `git add` on all staged `.js`, `.mjs` and `.jsx` files.

You can override the default configuration by placing a `.lintstagedrc` or `.lint-staged.config.js` file in your project's root or by adding a `lint-staged` property to `package.json`:

```js
const defaults = require('cellular-lint/lint-staged.config');
module.exports = Object.assign({}, defaults, {
  // custom config  
});
```
