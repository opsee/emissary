var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gutil = require('gulp-util');

gulp.task('uglify', ['browserify'], function() {
  return gulp.src('./dist/js/index.js')
    .pipe(uglify({
      mangle:false,
      compress:false
    }))
    .on('error', function(err, foo){
      gutil.error(err);
      this.emit('end');
    })
    .pipe(rename('index.min.js'))
    .pipe(gulp.dest('./dist/js'));
});