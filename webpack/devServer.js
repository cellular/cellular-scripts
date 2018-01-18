// @flow

const app = require('../lib/app');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

module.exports = {
  // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
  // websites from potentially accessing local content through DNS rebinding:
  // https://github.com/webpack/webpack-dev-server/issues/887
  // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
  // We disable the host check if no host has been explicitly specified:
  disableHostCheck: !process.env.HOST,
  compress: true,
  // Silence WebpackDevServer's own logs since they're generally not useful.
  // It will still show compile warnings and errors with this setting.
  clientLogLevel: 'none',
  stats: 'minimal',
  contentBase: app.static,
  // By default files from `contentBase` will not trigger a page reload.
  // NOTE: The contentBase itself is set in dev.js/prod.js.
  watchContentBase: true,
  publicPath: '/',
  // Reportedly, this avoids CPU overload on some systems.
  // https://github.com/facebookincubator/create-react-app/issues/293
  watchOptions: {
    ignored: /node_modules/
  },
  // Enable HTTPS if the HTTPS environment variable is set to 'true'
  https: protocol === 'https',
  host,
  port,
  overlay: true,
  historyApiFallback: {
    // Paths with dots should still use the history fallback.
    // See https://github.com/facebookincubator/create-react-app/issues/387.
    disableDotRule: true
  }
};
