var webpack = require('webpack');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: [
    '@babel/polyfill',
    // Add the client which connects to our middleware
    // You can use full urls like 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'
    // useful if you run your app from another point like django
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    // And then the actual application
    './client.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: '#source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  node: {
    require: 'empty',
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
