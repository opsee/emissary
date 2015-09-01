var gulp = require('gulp');
gulp.task('default', ['swagger'], function(){
  gulp.start('watch', 'server');
});