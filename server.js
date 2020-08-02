import http from 'http';
import React from 'react';
import ReactDOM from 'react-dom/server';
import express from 'express';
import webpack from 'webpack';

import App from './App';

const runtimeRequire = require('./runtimeRequire');

const { PORT = 3000 } = process.env;

var app = express();

app.get("/", (req, res) => {
  const markup = ReactDOM.renderToString(<App />);
  res.end(`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name=viewport content="width=device-width, initial-scale=1">
    <title>Webpack Hot Middleware Example</title>
  </head>
  <body>
  <div id="app">
  ${markup}
  </div>
  <script src="/bundle.js"></script>
  </body>
  </html>
  `)
});

var webpackConfig = runtimeRequire('webpack.config');

var compiler = webpack(webpackConfig);

// Step 2: Attach the dev middleware to the compiler & the server
app.use(require("webpack-dev-middleware")(compiler, {
  logLevel: 'warn', publicPath: webpackConfig.output.publicPath
}));

// Step 3: Attach the hot middleware to the compiler & the server
app.use(require("webpack-hot-middleware")(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));

var server = http.createServer(app);
server.listen(PORT, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Listening on port: ${server.address()}`)
  }
});
