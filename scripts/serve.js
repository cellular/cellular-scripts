module.exports = function() {
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';

  const chalk = require('chalk');
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const clearConsole = require('react-dev-utils/clearConsole');
  const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
  const {
    choosePort,
    prepareProxy,
    prepareUrls
  } = require('react-dev-utils/WebpackDevServerUtils');

  const app = require('../lib/app');
  const createDevServerConfig = require('../config/webpack/testServer');

  const isInteractive = process.stdout.isTTY;

  // Warn and crash if required files are missing
  if (!checkRequiredFiles([app.outputHtml])) {
    return 1;
  }

  const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';

  // We attempt to use the default port but if it is busy, we offer the user to
  // run on a different port. `detect()` Promise resolves to the next free port.
  return choosePort(HOST, DEFAULT_PORT).then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const urls = prepareUrls(protocol, HOST, port);
    // Create a webpack compiler that is configured with custom messages.
    const compiler = webpack({ entry: require.resolve('../lib/empty') });
    // Load proxy config
    const proxySetting = app.pkg.proxy;
    const proxyConfig = prepareProxy(proxySetting, app.static);
    // Serve webpack assets generated by the compiler over a web sever.
    const serverConfig = app.customize(
      'devServer',
      createDevServerConfig(proxyConfig, urls.lanUrlForConfig)
    );

    const devServer = new WebpackDevServer(compiler, serverConfig);
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting the server...\n'));
      console.log(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  });
};
