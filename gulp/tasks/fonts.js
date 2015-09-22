var gulp = require('gulp');
var config = require('../config').fonts;

gulp.task('buildFonts', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest))
});
