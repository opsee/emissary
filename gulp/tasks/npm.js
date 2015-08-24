var gulp = require('gulp');
var config = require('../config').html;
var shell = require('gulp-shell');

gulp.task('npm', function() {
  return gulp.src('*.js', {read:false}).pipe(shell([
    'npm install'
  ]));
});
