var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
config.entry.index.unshift("webpack-dev-server/client?http://localhost:8080", 'webpack/hot/only-dev-server');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  contentBase:'/'
})
.listen(8080, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:8080');
});