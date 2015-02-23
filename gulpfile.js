var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var envify = require('envify');

gulp.task('js-deps', function() {
  var b = browserify();
  b.require('react');
  b.require('material-ui');
  b.transform(reactify);
  b.transform(envify({
    NODE_ENV: 'development'
  }));

  return b.bundle()
    .pipe(source('deps.js'))
    .pipe(gulp.dest('./build'))
})

gulp.task('bundle-js', function() {
  var b = browserify('./app.jsx');
  b.external('react');
  b.external('material-ui');

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build'))
})