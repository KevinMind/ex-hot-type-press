const path = require('path');

const root = path.join(process.cwd(), '');

const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

const runtimeRequire = (pathname) => requireFunc(path.join(root, pathname));

module.exports = runtimeRequire;
