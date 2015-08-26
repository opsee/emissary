var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var connect = require('gulp-connect');
var config = require('../config').browserify;
var transform = require('vinyl-transform');

watchify.args.debug = config.debug;
var bundler = watchify(browserify(config.src, watchify.args), {poll:true});
config.transform.forEach(function(t) {
  bundler.transform(t);
});

gulp.task('browserifyWatch', bundle);
bundler.on('update', bundle);

gulp.task('browserify', function(){
  return browserify(config.src, config).bundle()
  .pipe(source('index.js'))
  .pipe(gulp.dest(config.dest))
});

function bundle() {
  return bundler.bundle()
  // log errors if they happen
  .on('error', function(err){
    gutil.log(err.toString(), 'Browserify Error');
    this.emit('end');
  })
  .pipe(source(config.outputName))
  .pipe(gulp.dest(config.dest))
  .pipe(connect.reload());
}
