// @flow

const path = require('path');
const webpack = require('webpack');

const devServer = require('./devServer');

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = function(env /*: ?Object */) {
  const common = require('./common')(env);
  return Object.assign({}, common, {
    devtool: 'cheap-module-source-map',
    output: Object.assign({}, common.output, {
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: true,
      filename: 'assets/bundle.js',
      chunkFilename: 'assets/[name].chunk.js',
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    }),
    plugins: [
      ...common.plugins,
      // Add module names to factory functions so they appear in browser profiler.
      new webpack.NamedModulesPlugin(),
    ],
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
    devServer,
  });
};
