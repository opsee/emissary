var gulp = require('gulp');
var config = require('../config');
var preprocess = require('gulp-preprocess');
var argv = require('yargs').argv;

gulp.task('html', function() {
  return gulp.src(config.html.src)
  .pipe(preprocess({context: { ENV: config.env, API:argv.api}}))
  .pipe(gulp.dest(config.html.dest));
});