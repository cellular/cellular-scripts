[![Build Status](https://travis-ci.org/fgnass/cellular-scripts.svg?branch=master)](https://travis-ci.org/fgnass/cellular-scripts)

This is a drop-in replacement for react-scripts that allows you to optionally provide custom configurations for webpack, Babel, ESLint, lint-staged and Jest.

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

# CLI

The `cellular-scripts` package provides a binary called `cs` that takes the name of a script as first argument:

* `cs start [options]`
  Starts a development server. Options are passed to the [webpack-dev-server CLI](https://webpack.js.org/configuration/dev-server/).
* `cs build [options]` Creates a production build using the built-in [defaults](#webpack). Refer to the webpack docs for a list of [available options](https://webpack.js.org/api/cli/).
* `cs serve` Serves a previously built production version.
* `cs test [options]` Runs the test. Options are passed on to [Jest](https://facebook.github.io/jest/docs/en/cli.html)
* `cs lint [options]`
  Runs [eslint](#eslint). Refer to the official docs for a list of [available options](https://eslint.org/docs/user-guide/command-line-interface).
* `cs precommit` Runs [lint-staged](#lint-staged).
* `cs postmerge` Runs [install-deps-postmerge](https://github.com/camacho/install-deps-postmerge).

# Configuration

## Directories

The directory layout can be customized via your project's package.json:

```json
{
    "directories": {
        "src": "src",
        "dist": "dist",
        "static": "static"
    }
}
```

* `src` where the source files are located. `src/index.js` is the default webpack entry.
* `dist` where webpack will place the output of production builds.
* `static` files that will be copied to `dist` verbatim. `static/index.html` gets processed by the [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/).

## Webpack

You can provide a custom webpack configuration by placing a `webpack.config.js` file in your project's root directory.

You can modify the default configuration like this:

```js
const webpackConfig = require('cellular-scripts/webpack');

module.exports = function(env) {
    const config = webpackConfig(env);
    // modify default config and return it
    return config;
}
```

The passed in `env` is either `{prod: true}` or `{dev: true}` depending on the script that was used (build or start).

Make sure to pass this information on to the `webpackConfig` function.

You can pass additional environment entries
which will be exposed via the webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

```js
module.exports = function(env) {
    return webpackConfig({
        ...env,
        FOO: null, // will be set to process.env.FOO
        BAR: 'bar', // defaults to 'bar'
    });
});
```

Both values can be overwritten by setting environment variables.

## Babel

### Default Babel Configuration

Presets:
* babel-preset-env
* babel-preset-flow (if project has flow-bin as dependency)
* babel-preset-react (if project as react or preact as dependency)

Plugins:
* babel-plugin-syntax-dynamic-import
* babel-plugin-transform-decorators-legacy
* babel-plugin-transform-class-properties
* babel-plugin-transform-object-rest-spread
* babel-plugin-minify-dead-code-elimination
* babel-plugin-dynamic-import-node (when tests are run)
* babel-plugin-glamorous-displayname (if project has glamorous as dependency)

__NOTE:__ Files under `node_modules` are run through Babel too, but with a much simpler configuration that only applies `babel-preset-env`.

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
  extends: [
    require.resolve('cellular-scripts/eslint')
  ]
};
```

__NOTE:__ The default config won't work if `cellular-scripts` are npm-linked or installed with an older npm version that doesn't flatten the dependency tree. See this [GitHub issue](https://github.com/eslint/eslint/issues/3458) for details.


## lint-staged

By default lint-staged will run `cs lint --fix` and optionally `flow focused-check` (if flow-bin is a dependency) followed by `git add` on all staged `.js`, `.mjs` and `.json` files.

You can override the default configuration by placing a `.lintstagedrc` or `.lint-staged.config.js` file in your project's root or by adding a `lint-staged` property to `package.json`:

```js
const defaults = require('cellular-scripts/lintstaged');
module.exports = Object.assign({}, defaults, {
  // custom config  
});
```
