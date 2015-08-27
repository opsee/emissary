var gulp = require('gulp');
var config = require('../config').html;
var preprocess = require('gulp-preprocess');
var argv = require('yargs').argv;

console.log('Preprocessing HTML as '+(argv.env || 'development'));

gulp.task('html', function() {
  return gulp.src(config.src)
  .pipe(preprocess({context: { ENV: argv.env}}))
  .pipe(gulp.dest(config.dest));
});