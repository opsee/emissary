var gulp = require('gulp');
var config = require('../config').html;
var shell = require('gulp-shell');

gulp.task('docker', ['build'], function() {
  return gulp.src('/', {read:false}).pipe(shell([
    'docker build -t quay.io/opsee/emissary .'
    ]))
});