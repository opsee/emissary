var gulp = require('gulp');
var config = require('../config');
var preprocess = require('gulp-preprocess');

gulp.task('html', function() {
  return gulp.src(config.html.src)
  .pipe(preprocess({context: { ENV: config.env, API:config.api}}))
  .pipe(gulp.dest(config.html.dest));
});