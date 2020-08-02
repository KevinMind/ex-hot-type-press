const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const { paths } = require('./runtimeRequire');

const { NODE_ENV = 'development' } = process.env;

const isDev = NODE_ENV === 'development';

const baseConfig = {
  mode: NODE_ENV,
  target: 'web',
  entry: {
    client: [
      '@babel/polyfill',
      // Add the client which connects to our middleware
      // You can use full urls like 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'
      // useful if you run your app from another point like django
      // And then the actual application
      paths.srcClient,
    ]
  },
  output: {
    path: paths.buildClient,
    publicPath: '',
    filename: 'index.js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ManifestPlugin({
      fileName: paths.buildAssetManifest,
      writeToFileEmit: true,
      filter: item => item.isChunk,
      generate: (seed, files) => {
        const entrypoints = new Set();
        files.forEach(file =>
          ((file.chunk || {})._groups || []).forEach(group =>
            entrypoints.add(group)
          )
        );
        const entries = [...entrypoints];
        const entryArrayManifest = entries.reduce((acc, entry) => {
          const name =
            (entry.options || {}).name || (entry.runtimeChunk || {}).name || entry.id;
          const files = []
            .concat(
              ...(entry.chunks || []).map(chunk =>
                chunk.files.map(path => baseConfig.output.publicPath + path)
              )
            )
            .filter(Boolean);

          const cssFiles = files
            .map(item => (item.indexOf('.css') !== -1 ? item : null))
            .filter(Boolean);

          const jsFiles = files
            .map(item => (item.indexOf('.js') !== -1 ? item : null))
            .filter(Boolean);

          return name
            ? {
              ...acc,
              [name]: {
                css: cssFiles,
                js: jsFiles,
              },
            }
            : acc;
        }, seed);
        return entryArrayManifest;
      },
    }),
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

if (isDev) {
  baseConfig.entry.client.push(
    'webpack-hot-middleware/client',
  );
  baseConfig.devtool = '#source-map';
  baseConfig.plugins.unshift(
    new webpack.HotModuleReplacementPlugin(),
  )
}

module.exports = baseConfig;
