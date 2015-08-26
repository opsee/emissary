var gulp = require('gulp');
gulp.task('prod', ['uglify', 'htmlProd', 'styles', 'buildImg']);