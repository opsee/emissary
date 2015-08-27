var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', ['watchJs','watchSass', 'watchImg', 'watchHtml'], function(){
})

gulp.task('watchJs', function() {
  gulp.watch(config.watch.js, ['buildJs']);
});

gulp.task('watchSass', function() {
  gulp.watch(config.watch.sass, ['buildSass']);
});

gulp.task('watchImg', function() {
  gulp.watch(config.img.src, ['buildImg']);
});

gulp.task('watchHtml', function() {
  gulp.watch(config.html.src, ['html']);
});