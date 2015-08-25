var gulp = require('gulp');
var config = require('../config').html;
var shell = require('gulp-shell');
var git = require('gulp-git');

gulp.task('status', function() {
  git.status({}, function(err, stdout){
    console.log(stdout);
  })
});

//testing
