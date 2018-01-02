const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const app = require('../../lib/app');

module.exports = function({ prod = false }) {
  // Get environment variables to inject into our app.
  const env = require('../../lib/env');

  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringifiedEnv = {
    'process.env': Object.keys(env).reduce((obj, key) => {
      obj[key] = JSON.stringify(env[key]);
      return obj;
    }, {})
  };

  // Assert this just to be safe.
  // Development builds of React are slow and not intended for production.
  if (prod && env.NODE_ENV !== 'production') {
    throw new Error('Production builds must have NODE_ENV=production.');
  }

  return {
    resolve: {
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebookincubator/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
      alias: {
        // Resolve Babel runtime relative to cellular-scripts.
        // It usually still works on npm 3 without this but it would be
        // unfortunate to rely on, as cellular-scripts could be symlinked.
        'babel-runtime': path.dirname(
          require.resolve('babel-runtime/package.json')
        ),
        // @remove-on-eject-end
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web'
      },
      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(app.src, [app.packageJson])
      ]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          parser: { requireEnsure: false }
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // Process JS with Babel.
            {
              test: /\.(js|jsx)$/,
              include: app.src,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                presets: [require.resolve('../babelrc')],
                cacheDirectory: true
              }
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // it's runtime that would otherwise processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.js$/, /\.html$/, /\.json$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'assets/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV was set to production here.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(stringifiedEnv),

      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: false,
        template: app.html,
        env,
        minify: prod && {
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      })
    ],

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  };
};
