var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var fs = require('fs');

var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var context_dir = path.join(__dirname, '/src');

var config;
try{
  config = JSON.stringify(fs.readFileSync(path.join(__dirname, '/config.json')).toString());
}catch(err){}

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __API__: JSON.stringify(process.env.CONFIG_API),
  __AUTH__: JSON.stringify(process.env.CONFIG_AUTH),
  'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV)},
  __REVISION__: JSON.stringify(fs.readFileSync('/dev/stdin').toString()),
  __CONFIG__: config
});
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js');

var vendors = ['lodash', 'react', 'moment', 'slate', 'newforms', 'react-bootstrap', 'immutable', 'q', 'react-router', 'superagent', 'fuzzy', 'react-document-title', 'react-timeago'];

module.exports = {
  cache:true,
  context:context_dir,
  eslint:{
    configFile:'./node_modules/opsee-style/.eslintrc'
  },
  entry: {
    'index': [
      'babel-polyfill',
      './js/index.jsx'
    ],
    vendor:vendors
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js",
    chunkFilename: "[name]-[id].[hash].js"
  },
  postcss: function(webpack){
    return [
      require('postcss-import')({
        addDependencyTo: webpack
      }),
      require('postcss-cssnext')(),
      require('postcss-url')()
    ];
  },
  module: {
    preLoaders:[
      { test: /\.js$|\.jsx$/, loaders: ['eslint-loader'], include: [context_dir] },
    ],
    loaders: [
      { test: /\.global\.css$/, loader: 'style-loader!css-loader?&importLoaders=1!postcss-loader', include: [context_dir]},
      { test: /^(?!.*global\.css$).*\.css$/, loader: 'style-loader!css-loader?module&localIdentName=[path][name]-[local]&importLoaders=1!postcss-loader'},
      {test: /\.js$|\.jsx$/, loaders: ['react-hot'], include: [context_dir] },
      {
        test: /\.js$|\.jsx$/, 
        loader: 'babel-loader',
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react']
        },
        include: [context_dir]
      },
      { test: /\.json$/, loaders: ['json'], include: [context_dir]},
      {test: /\.(png|jpg|svg)$/, loader: 'url-loader?limit=8192', include: [context_dir]}
    ]
  },
  noParse:vendors.map(v => path.join(__dirname, 'node_modules/'+v)),
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
