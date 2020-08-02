const path = require('path');

const root = path.join(process.cwd(), '');

const build = 'build';
const client = 'client';
const server = 'server';
const src = '.src';

const paths = {
  buildAssetManifest: path.join(root, build, 'chunks.json'),
  buildClient: path.join(root, build, client),
  buildServer: path.join(root, build, server),
  srcClient: path.join(root, src, client),
  srcClientApp: path.join(root, 'src', 'App'),
  srcServer: path.join(root, src, server),
};

const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

const requireRoot = (pathname) =>  requireFunc(path.join(root, pathname));

const requireSrc = (pathname) => requireFunc(path.join(root, src, pathname));

const requireAssetManifest = () => requireFunc(paths.buildAssetManifest);

module.exports = {
  root,
  paths,
  requireRoot,
  requireSrc,
  requireAssetManifest,
};
