const gulp = require('gulp');
const sass = require('gulp-sass');
const connect = require('gulp-connect');
const config = require('../config.js');
const compass = require('gulp-compass');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('compass', function(){
  gulp.src(config.compass.dist.sass)
    .pipe(compass(config.compass.dist))
    // .pipe(gulp.dest(config.compass.dist.css))
});

gulp.task('sass', function(){
  gulp.src(config.sass.src)
  .pipe(sass({}).on('error', sass.logError))
  .pipe(gulp.dest(config.sass.dest));
})

gulp.task('autoprefix', function(){
  gulp.src(config.compass.dist.css+'/style.css')
    .pipe(autoprefixer('last 10 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(config.compass.dist.css))
    .pipe(connect.reload())
})

gulp.task('styles', ['compass'], function() {
  // gulp.start('autoprefix');
});
