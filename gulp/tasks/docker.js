var gulp = require('gulp');
var config = require('../config').html;
var shell = require('gulp-shell');

gulp.task('docker', ['prod'], function() {
  return gulp.src('/', {read:false}).pipe(shell([
    'docker build -t quay.io/opsee/emissary:latest .'
    ]))
});

gulp.task('test', function() {
  console.log('TEST HEY');
});