var gulp = require('gulp');
gulp.task('prod', ['uglify', 'html', 'styles', 'buildImg']);