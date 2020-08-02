const copydir = require('copy-dir');
const rimraf = require('rimraf');
const path = require('path');
const webpack = require('webpack');

const root = path.join(__dirname, '..');
const pwd = path.join(process.cwd(), '');

process.env.NODE_ENV = 'production';

module.exports = async () => {
  const from = path.join(root, 'src');
  const to = path.join(pwd, '.src');
  await copydir.sync(from, to);
  await rimraf.sync(path.join(pwd, 'build'));
  const clientCompiler = webpack(require(path.join(pwd, '.src', 'webpack.config')));

  clientCompiler.run((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });

  const serverCompiler = webpack(require(path.join(pwd, '.src', 'webpack.server')));

  serverCompiler.run((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });


};
