/*eslint-disable camelcase*/

const webpack = require('webpack');
const fs = require('fs');
const _ = require('lodash');

const path = require('path');
const node_modules = path.resolve(__dirname, 'node_modules');
const context_dir = path.join(__dirname, '/src');
const vendors = require(path.join(__dirname, '/util/vendors'));

const revision = fs.readFileSync('/dev/stdin').toString();

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    REVISION: JSON.stringify(revision)
  }
});

const uglify = new webpack.optimize.UglifyJsPlugin({
  mangle: true,
  compress: {
    warnings: false
  }
});

const config = {
  cache: true,
  context: context_dir,
  node: {
    fs: 'empty'
  },
  eslint: {
    configFile: `${node_modules}/opsee-style/.eslintrc`
  },
  entry: {
    vendor: _.keys(vendors.vendors)
  },
  output: {
    path: path.join(__dirname, 'dist'),
    // publicPath: "/",
    filename: `vendor.${vendors.hash}.js`,
    library: 'opseeVendor'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  },
  noParse: _.keys(vendors.vendors).map(v => `${node_modules}/${v}`),
  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.svg', '.png', '.jpg'],
    modulesDirectories: ['node_modules']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    definePlugin,
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist/opseeVendorManifest.json'),
      name: 'opseeVendor'
    })
  ]
};

if (process.env.NODE_ENV === 'production'){
  config.eslint.failOnWarning = true;
  config.plugins.push(uglify);
}

module.exports = config;