var gulp = require('gulp');
var config = require('../config').watch;

gulp.task('watch', ['watchJs','watchSass'], function(){
})

gulp.task('watchJs', [], function() {
  gulp.watch(config.srcJS, ['buildJs']);
});

gulp.task('watchSass', [], function() {
  gulp.watch(config.srcSass, ['buildSass']);
});