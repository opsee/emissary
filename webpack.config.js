var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var fs = require('fs');
var _ = require('lodash');

var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var context_dir = path.join(__dirname, '/src');

var definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  },
  __REVISION__: JSON.stringify(fs.readFileSync('/dev/stdin').toString())
});

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js');

var vendors = ['lodash', 'react', 'moment', 'slate', 'newforms', 'react-bootstrap', 'immutable', 'q', 'react-router', 'superagent', 'fuzzy', 'react-document-title', 'react-timeago'];

var uglify = new webpack.optimize.UglifyJsPlugin({
  mangle: true,
  compress: {
    warnings: false
  }
});

var config = {
  cache:true,
  context:context_dir,
  eslint:{
    configFile: `${node_modules}/opsee-style/.eslintrc`
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
      require('postcss-cssnext')({
        browsers: 'last 1 version, > 10%'
      }),
      require('postcss-url')()
    ];
  },
  module: {
    preLoaders:[
      {
        test: /\.js$|\.jsx$/, 
        loaders: ['eslint-loader'], 
        include: [context_dir]
      },
    ],
    loaders: [
      {
        test: /\.global\.css$/,
        loader: 'style-loader!css-loader?&importLoaders=1!postcss-loader',
        include: [context_dir]
      },
      {
        test: /^(?!.*global\.css$).*\.css$/,
        loader: 'style-loader!css-loader?module&localIdentName=[path][name]-[local]&importLoaders=1!postcss-loader'
      },
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react']
        },
        include: [context_dir]
      },
      {
        test: /\.json$/,
        loaders: ['json']
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'url-loader?limit=8192',
        include: [context_dir]
      }
    ]
  },
  noParse:vendors.map(v => `${node_modules}/${v}`),
  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.svg', '.png', '.jpg'],
    modulesDirectories: ['node_modules']
  },
  plugins: [
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

if (process.env.NODE_ENV === 'production'){
  config.eslint.failOnWarning = true;
  config.plugins.push(uglify);
  config.plugins.push(new ExtractTextPlugin('style.css'));
  config.module.loaders = config.module.loaders.map(item => {
    if (_.isEqual(item.test, /\.global\.css$/)){
      item.loader = ExtractTextPlugin.extract('style-loader', 'css-loader?&importLoaders=1!postcss-loader')
    }
    if (_.isEqual(item.test, /^(?!.*global\.css$).*\.css$/)){
      item.loader = ExtractTextPlugin.extract('style-loader', 'css-loader?module&localIdentName=[path][name]-[local]&importLoaders=1!postcss-loader')
    }
    return item;
  });
} else {
  config.module.loaders.splice(2, 0, {
    test: /\.js$|\.jsx$/,
    loaders: ['react-hot'],
    include: [context_dir]
  });
  config.plugins.splice(1, 0, new webpack.HotModuleReplacementPlugin());
}

module.exports = config;