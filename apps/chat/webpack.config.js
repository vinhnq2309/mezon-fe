const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact({
    // Uncomment this line if you don't want to use SVGR
    // See: https://react-svgr.com/
    // svgr: false
  }),
  (config) => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    config.plugins.push(new NodePolyfillPlugin());
    config.resolve.fallback = { "fs": false };
    return config;
  },
);
