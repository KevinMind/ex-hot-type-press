const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
const { paths } = require('./runtimeRequire');

const { NODE_ENV = 'development' } = process.env;

const isDev = NODE_ENV === 'development';

const baseConfig = {
  mode: NODE_ENV,
  entry: {
    server: [
      paths.srcServer,
    ]
  },
  output: {
    path: paths.buildServer,
    publicPath: '/',
    filename: 'index.js'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  target: 'node',
  externals: nodeExternals(),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};

if (isDev) {
  baseConfig.plugins.unshift(
    new webpack.HotModuleReplacementPlugin(),
    new StartServerPlugin({
      name: 'index.js',
      signal: false,
      keyboard: true,
    }),
  );
  baseConfig.devtool = 'inline-sourcemap';
  baseConfig.watch = true;
  baseConfig.watchOptions = {
    aggregateTimeout: 200,
      poll: 1000,
      ignored: [
        paths.srcClient,
        paths.srcClientApp,
    ]
  };
}

module.exports = baseConfig;
