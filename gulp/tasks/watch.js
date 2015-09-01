var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', ['watchJs','watchSass', 'watchImg', 'watchHtml'], function(){
})

gulp.task('watchJs', ['buildJs'], function() {
  gulp.watch(config.watch.js, ['buildJs']);
});

gulp.task('watchSass', ['buildSass'], function() {
  gulp.watch(config.watch.sass, ['buildSass']);
});

gulp.task('watchImg', ['buildImg'], function() {
  gulp.watch(config.img.src, ['buildImg']);
});

gulp.task('watchHtml', ['html'], function() {
  gulp.watch(config.html.src, ['html']);
});