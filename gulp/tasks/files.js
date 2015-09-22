var gulp = require('gulp');
var config = require('../config').files;

gulp.task('buildFiles', ['revision'], function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest))
});
