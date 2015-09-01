var gulp = require('gulp');
var config = require('../config').html;
var shell = require('gulp-shell');
var request = require('request');
var fs = require('fs');
var source = require('vinyl-source-stream');
var CodeGen = require('swagger-js-codegen').CodeGen;
var stream = require('event-stream');
var buffer = require('vinyl-buffer');

function makeChange(kwargs) {
  // you're going to receive Vinyl files as chunks
  function transform(file, cb) {
    // read and modify file contents
    var spec = JSON.parse(String(file.contents));
    spec.info.title = 'foo';
    var code = CodeGen.getNodeCode({className:kwargs.className, swagger:spec});
    file.contents = new Buffer(String(code));
    // if there was some error, just pass as the first parameter here
    cb(null, file);
  }

  // returning the map will cause your transform function to be called
  // for each one of the chunks (files) you receive. And when this stream
  // receives a 'end' signal, it will end as well.
  // 
  // Additionally, you want to require the `event-stream` somewhere else.
  return stream.map(transform);
}

gulp.task('swaggerApi', function(){
  return request('http://api-beta.opsee.co/api/swagger.json')
    .pipe(source('api.js'))
    .pipe(buffer())
    .pipe(makeChange({className:'Api'}))
    .pipe(gulp.dest('./src/js/swagger/'))
})

gulp.task('swaggerAuth', function(){
  return request('https://auth.opsee.co/swagger.json')
    .pipe(source('auth.js'))
    .pipe(buffer())
    .pipe(makeChange({className:'Auth'}))
    .pipe(gulp.dest('./src/js/swagger/'))
})

gulp.task('swagger', ['swaggerApi', 'swaggerAuth']);