var gulp = require('gulp');
var config = require('../config').img;

gulp.task('buildImg', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
