// @flow

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const app = require('../lib/app');
const { processEnv } = require('./env');
const { fileContains } = require('../lib/util');
const loaders = require('./loaders');

const template = `${app.static}/index.html`;

module.exports = function(env /*: any */) {
  const { vars, define } = processEnv(env);
  return {
    entry: [app.src],
    output: {
      path: app.dist,
      publicPath: '/',
    },
    resolve: {
      modules: ['node_modules', path.resolve(__dirname, '..', 'node_modules')],
      extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.mjs'],
      alias: {
        // Resolve Babel runtime relative to cellular-scripts.
        // It usually still works on npm 3 without this but it would be
        // unfortunate to rely on, as cellular-scripts could be symlinked.
        'babel-runtime': path.dirname(
          require.resolve('babel-runtime/package.json')
        ),
        // Support React Native Web
        'react-native': 'react-native-web',
      },
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          // Disable require.ensure as it's not a standard language feature.
          parser: { requireEnsure: false },
        },
        {
          oneOf: [loaders.babel, loaders.deps, loaders.file],
        },
      ],
    },

    plugins: [
      new CaseSensitivePathsPlugin(),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }
      new webpack.DefinePlugin(define),

      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        template,
        inject: !fileContains(template, /<%=.*\.entry/),
        env: vars,
        minify: {
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    ],

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};
