var gulp = require('gulp');
var connect = require('gulp-connect');
var config = require('../config').watch;

gulp.task('build', ['buildJs', 'buildSass'], function() {
  // gulp.src(config.src).pipe(connect.reload());
});

gulp.task('buildJs', ['browserify', 'html'], function() {
  gulp.src(config.srcJs).pipe(connect.reload());
});

gulp.task('buildSass', ['styles'], function() {
  // console.log(config.src);
  // gulp.src(config.srcSass).pipe(connect.reload());
});
