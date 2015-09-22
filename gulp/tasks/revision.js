var gulp = require('gulp');
var git = require('gulp-git');
var config = require('../config');

gulp.task('revision', function(end) {
  git.revParse({args:'HEAD'}, function(err, hash){
    process.env.Revision = hash;
    end();
  });
});