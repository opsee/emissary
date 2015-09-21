var gulp = require('gulp');

gulp.task('preProd', ['html', 'styles', 'buildImg'], function(){
  gulp.start('buildFiles');
});

gulp.task('prod', ['preProd'], function(){
  gulp.start('uglify');
});