var gulp = require('gulp');
gulp.task('prod', ['swagger', 'uglify', 'html', 'styles', 'buildImg']);