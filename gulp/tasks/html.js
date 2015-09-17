var gulp = require('gulp');
var config = require('../config');
var preprocess = require('gulp-preprocess'); 

gulp.task('html', ['revision'], function() {
  console.log(config.revision);
  return gulp.src(config.html.src)
  .pipe(preprocess({context: { ENV: config.env, API:config.api, REV:config.revision}}))
  .pipe(gulp.dest(config.html.dest));
});