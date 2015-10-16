var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var GitSHAPlugin = require('git-sha-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var context_dir = path.join(__dirname, '/src');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __API__: JSON.stringify(JSON.parse(process.env.API || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js');

module.exports = {
  cache:true,
  context:context_dir,
  entry: {
    'index': [
      './js/index.jsx'
    ],
    vendor:['lodash', 'react', 'moment', 'slate', 'newforms', 'react-bootstrap', 'immutable', 'q', 'react-router', 'superagent', 'fuzzy', 'highlight.js', 'react-document-title', 'react-g-analytics', 'react-router-bootstrap', 'react-timeago']
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js",
  },
  module: {
    loaders: [
      { test: /\.global\.css$/, loader: 'style-loader!css-loader!cssnext-loader', include: [context_dir]},
      { test: /^(?!.*global\.css$).*\.css$/, loader: 'style-loader!css-loader?module&localIdentName=[path][name]-[local]-[hash:base64:5]!cssnext-loader'},
      { test: /\.js$|\.jsx$/, loaders: ['react-hot', 'babel-loader?optional[]=runtime&stage=0'], include: [context_dir] },
      { test: /\.json$/, loaders: ['json'], include: [context_dir]},
      {test: /\.(png|jpg|svg)$/, loader: 'url-loader?limit=8192', include: [context_dir]}
    ]
  },
  noParse:[
    path.join(__dirname, 'node_modules/react'),
    path.join(__dirname, 'node_modules/slate'),
    path.join(__dirname, 'node_modules/newforms'),
    path.join(__dirname, 'node_modules/moment'),
    path.join(__dirname, 'node_modules/lodash')
  ],
  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.svg', '.png', '.jpg'],
    modulesDirectories: ['node_modules']
  },

  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    definePlugin,
    new HtmlWebpackPlugin({
      hash:false,
      template:'src/index.html'
    }),
    commonsPlugin
  ]
};