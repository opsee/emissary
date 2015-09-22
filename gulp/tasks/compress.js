var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var config = require('../config');

gulp.task('uglify', ['browserify'], function() {
  if(!process.env.Revision){
    throw new gutil.PluginError({
      plugin: 'uglify',
      message: 'No revision found'
    });
  }
  return gulp.src('./dist/js/index.js')
    .pipe(uglify({
      mangle:false,
      compress:false
    }))
    .on('error', function(err, foo){
      gutil.error(err);
      this.emit('end');
    })
    .pipe(rename('index.'+process.env.Revision+'.min.js'))
    .pipe(gulp.dest('./dist/js'));
});