const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

const pwd = process.cwd();
const root = path.join(pwd, '');

module.exports = {
  mode: 'development',
  entry: [
    './server.js'
  ],
  output: {
    path: path.join(root, 'build'),
    publicPath: '/',
    filename: 'server.js'
  },
  devtool: 'inline-sourcemap',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new NodemonPlugin(),
  ],
  target: 'node',
  externals: nodeExternals(),
  watch: true,
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: [
      path.join(root, 'client.js'),
      path.join(root, 'App.js'),
    ]
  },
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
