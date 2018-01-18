This is a drop-in replacement for react-scripts that allows you to optionally provide custom configurations for webpack, babel, eslint, lint-staged and jest.

## Usage

```
npx create-react-app --scripts-version cellular-scripts myapp
```

## Custom webpack config

webpack.config.js
```js
module exports = function(env) {
    const config = require('cellular-scripts/webpack')(env);
    // modify default config and return it
    return config;
}
```

## Custom babel config

.babelrc
```json
{
    "presets": ["cellular-scripts/babel"]
}
```

## Custom eslint config

.eslintrc.js
```js
{
  extends: require.resolve('cellular-scripts/eslint')
}
```

Unfortunately EsLint doesn't support the bundling of plugins inside of shared configs (see this [GitHub issue](https://github.com/eslint/eslint/issues/3458)).

In practice it does work due to the fact that npm flattens the dependency tree, but will fail if you either use an old npm version or you `npm-link` cellular-scripts.

## Custom lint-staged config

## Custom jest config