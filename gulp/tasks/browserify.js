var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var connect = require('gulp-connect');
var config = require('../config').browserify;
var transform = require('vinyl-transform');
var notify = require("gulp-notify");

gulp.task('browserify', function(){
  return buildScript();
  return buildScript(config.src);
});

gulp.task('browserifyWatch', function(){
  return buildScript(true);
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(watch) {
  var props = {
    entries: [config.src], 
    paths: ['./src/js/', './node_modules'],
    src: config.src,
    dest: config.dest,
    transform:['babelify', 'reactify'],
    outputName:'index.js'
  };
  // var bundler = browserify(config.src, props);
  var bundler = browserify(config.src, watchify.args);
  bundler = watch ? watchify(bundler) : bundler;
  config.transform.forEach(function(t) {
    bundler.transform(t);
  });
  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', handleErrors)
    .pipe(source('index.js'))
    .pipe(gulp.dest(config.dest))
  }

  if(watch){
    bundler.on('update', function() {
      rebundle();
      gutil.log('Rebundle...');
    });
  }
  return rebundle();
}