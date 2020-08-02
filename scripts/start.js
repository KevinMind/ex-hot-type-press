const copydir = require('copy-dir');
const rimraf = require('rimraf');
const path = require('path');
const webpack = require('webpack');

const root = path.join(__dirname, '..');
const pwd = path.join(process.cwd(), '');

process.env.NODE_ENV = 'development';

module.exports = async () => {
  const from = path.join(root, 'src');
  const to = path.join(pwd, '.src');
  await copydir.sync(from, to);
  await rimraf.sync(path.join(pwd, 'build'));

  const serverConfig = require(path.join(pwd, '.src', 'webpack.server'));
  const serverCompiler = webpack(serverConfig);

  serverCompiler.watch(serverConfig.watchOptions, (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });



};
