const gulp = require('gulp');
const sass = require('gulp-sass');
const connect = require('gulp-connect');
const config = require('../config.js').compass;
const compass = require('gulp-compass');

gulp.task('styles', function() {
  gulp.src(config.dist.sass)
    .pipe(compass(config.dist))
    .pipe(gulp.dest(config.dist.css))
    .pipe(connect.reload());
});
