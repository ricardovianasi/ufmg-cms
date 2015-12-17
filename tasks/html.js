var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');
var plumber = require('gulp-plumber');

gulp.task('html', ['generate-index'], function () {
  var opts = {
    comments: true
  };

  gulp.src(['./app/**/*.html', '!./app/index.html'])
    .pipe(plumber())
    .pipe(minifyHTML())
    .pipe(gulp.dest('./build/'))
});

gulp.task('generate-index', function () {
  gulp.src('./app/index.html')
    .pipe(plumber())
    .pipe(jade({pretty: true}))
    .pipe(minifyHTML())
    .pipe(gulp.dest('./build/'))
});
