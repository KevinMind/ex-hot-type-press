import http from 'http';
import express from 'express';
import webpack from 'webpack';

import { getMarkup } from '../src/server';

const { requireSrc, requireAssetManifest, paths } = require('./runtimeRequire');

const { PORT = 3000, NODE_ENV = 'development' } = process.env;

var app = express();

if (NODE_ENV === 'development') {
  // Step 1: build client webpack bundle.
  var webpackConfig = requireSrc('./webpack.config');
  var compiler = webpack(webpackConfig);

// Step 2: Attach the dev middleware to the compiler & the server
  app.use(require("webpack-dev-middleware")(compiler, {
    serverSideRender: true,
    writeToDisk: (filePath) => {
      const isManifest = /manifest\.json$/.test(filePath);
      const isIndex = /index\.js$/.test(filePath);
      return isIndex || isManifest;
    },
    logLevel: 'warn',
  }));

// Step 3: Attach the hot middleware to the compiler & the server
  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
    dynamicPublicPath: '/static',
    timeout: 20000,
  }));
} else {
  console.log(`static: /static -> ${paths.buildClient}`);
  app.use('/static', express.static(paths.buildClient));
}

app.get("/", async (req, res) => {
  const { client: clientAssets } = requireAssetManifest();
  const assets = Object.values(clientAssets.js)
    .map(file => {
      if (NODE_ENV !== 'development') {
        return `/static/${file}`
      }
      return file;
    })
    .map(file => `<script src="${file}" async defer></script>`)
    .join('\n');
  const markup = getMarkup(req, res);
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
  ${assets}
  </body>
  </html>
  `)
});

var server = http.createServer(app);
server.listen(PORT, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Listening on port: ${PORT}`)
  }
});
