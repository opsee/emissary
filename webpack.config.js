var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var GitSHAPlugin = require('git-sha-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
  context:path.join(__dirname, '/src'),
  entry: {
    'index': [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/only-dev-server',
      './js/index.jsx'
    ]
  },
  output: {
    path: path.join(__dirname, "dist"),
    // publicPath: "",
    filename: "bundle.js",
    // chunkFilename: "[id].[hash].bundle.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader?module!cssnext-loader') },
      { test: /\.js$|\.jsx$/, loaders: ['react-hot', 'babel-loader?optional[]=runtime&stage=0'], exclude: /node_modules/ },
      { test: /\.json$/, loaders: ['json']},
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
    ]
  },

  resolve: {
    extensions: ['', '.jsx', '.js', '.json'],
    modulesDirectories: ['node_modules']
  },

  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    definePlugin,
    // new AssetsPlugin(),
    new HtmlWebpackPlugin({
      hash:true,
      template:'src/index.html'
    })
    // commonsPlugin
  ]
};
