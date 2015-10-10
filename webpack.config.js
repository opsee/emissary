var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path');

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
    filename: 'index.js',
    path: path.join(__dirname, '/dist/'),
    publicPath: '/dist/'
  },

  module: {
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader?module!cssnext-loader') },
      { test: /\.js$|\.jsx$/, loaders: ['react-hot', 'babel-loader?optional[]=runtime&stage=0'], exclude: /node_modules/ },
      { test: /\.json$/, loaders: ['json']}
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
    new webpack.NoErrorsPlugin()
  ]
};
