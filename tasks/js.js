
var gulp            = require('gulp'),
	  concat          = require('gulp-concat'),
	  rename          = require('gulp-rename'),
    uglify    		  = require('gulp-uglify'),
    angularFilesort = require('gulp-angular-filesort'),
    naturalSort     = require('gulp-natural-sort'),
    ngAnnotate      = require('gulp-ng-annotate'),
    sourcemaps      = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber'),
    stylish = require('jshint-stylish'),
    jshint = require('gulp-jshint');

gulp.task('js', function() {
  return gulp.src(['./app/**/*.js'])
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
      .pipe(babel())
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/scripts/'));
});
