// @flow

const path = require('path');
const app = require('about-this-app');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const devServer = require('./devServer');

const opts = app.pkg['cellular-scripts'] || {};

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = opts.generateSourceMap !== false;
const assetNamePattern = opts.assetNamePattern || 'assets/[name].[chunkhash:8]';

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = (env /*: ?Object */, argv /*: Object */) => {
  const common = require('./common')(env, argv);
  return Object.assign({}, common, {
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: shouldUseSourceMap ? 'source-map' : false,
    output: Object.assign({}, common.output, {
      filename: `${assetNamePattern}.js`,
      chunkFilename: `${assetNamePattern}.chunk.js`,
      devtoolModuleFilenameTemplate: info =>
        path
          .relative(app.dir('src'), info.absoluteResourcePath)
          .replace(/\\/g, '/'),
    }),
    plugins: [
      new CleanWebpackPlugin([app.dir('dist')], {
        root: app.root,
      }),
      ...common.plugins,
      new ExtractTextPlugin(`${assetNamePattern}.css`),
      new CopyWebpackPlugin([{ from: app.dir('static') }]),
      // Generate a manifest file which contains a mapping of all asset filenames
      // to their corresponding output file so that tools can pick it up without
      // having to parse `index.html`.
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
      }),
    ],
    devServer: Object.assign({}, devServer, {
      contentBase: app.dir('dist'),
      hot: false,
    }),
  });
};
