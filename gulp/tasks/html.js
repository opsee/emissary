var gulp = require('gulp');
var config = require('../config');
var preprocess = require('gulp-preprocess'); 

gulp.task('html', ['revision'], function() {
  if(!process.env.Revision){
    throw new gutil.PluginError({
      plugin: 'html',
      message: 'No revision found'
    });
  }
  return gulp.src(config.html.src)
  .pipe(preprocess({context: {
    ENV: config.env, 
    API:config.api, 
    REV:process.env.Revision,
    SLACK_CLIENT_SECRET:process.env.SLACK_CLIENT_SECRET
  }}))
  .pipe(gulp.dest(config.html.dest));
});