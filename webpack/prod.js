// @flow

const path = require('path');
const app = require('about-this-app');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const devServer = require('./devServer');

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const assetNamePattern =
  process.env.ASSET_NAME_PATTERN || 'assets/[name].[chunkhash:8]';

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = (env /*: ?Object */) => {
  const common = require('./common')(env);
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
      new webpack.optimize.ModuleConcatenationPlugin(),
      // Minify the code.
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebookincubator/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
        },
        output: {
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebookincubator/create-react-app/issues/2488
          ascii_only: true,
        },
        sourceMap: shouldUseSourceMap,
      }),
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
