var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('prodNotify', function(){
  console.log('Production Task Has Finished.');
});

gulp.task('preProd', function(cb){
  runSequence(['html', 'styles', 'buildImg'], 'buildFiles', 'uglify', cb);
});

gulp.task('prod', ['preProd'], function(cb){
  runSequence('docker', 'prodNotify', cb);
});