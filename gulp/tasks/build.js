var gulp = require('gulp');
var connect = require('gulp-connect');
var config = require('../config').watch;

gulp.task('build', ['buildJs', 'buildSass', 'buildImg'], function() {
  // gulp.src(config.src).pipe(connect.reload());
});

gulp.task('buildJs', ['browserify', 'html'], function() {
  gulp.src(config.js).pipe(connect.reload());
});

gulp.task('buildSass', ['styles'], function() {
  gulp.src(config.sass).pipe(connect.reload());
});
