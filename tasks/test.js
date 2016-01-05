var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var angularFilesort = require('gulp-angular-filesort');
var naturalSort = require('gulp-natural-sort');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');
var expect = require('gulp-expect-file');

var files = [
  // Env
  'app/common/config/env.js',

  // Helpers
  'app/helpers/**/*.js',

  // Filters
  'app/filters/**/*.js',

  // Services
  'app/services/**/*.js',

  // Components
  'app/components/**/*.js',

  // Modules
  'app/modules/**/*.js',

  // Common
  'app/app.js',
  'app/common/config/app.config.js'
];

gulp.task('test-js', ['copy-xenon'], function () {
  //return gulp.src(files)
  return gulp.src(['app/**/*.js', '!app/assets/**/*.js'])
    .pipe(plumber())
    .pipe(jshint({
      esnext: true,
      strict: true
    }))
    .pipe(jshint.reporter(stylish))
    .pipe(naturalSort())
    .pipe(angularFilesort())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(sourcemaps.init())
    .pipe(babel({compact: false}))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/scripts/'));
});
