var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var angularFilesort = require('gulp-angular-filesort');
var naturalSort = require('gulp-natural-sort');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');
var commons = require('./commons.js');
var babel = require('gulp-babel');

gulp.task('js', function () {
    return gulp
        .src(['app/**/*.js',
            '!app/assets/**/*.js'
        ])
        .pipe(plumber())
        .pipe(jshint({
            esnext: true,
            strict: true
        }))
        .pipe(jshint.reporter(stylish))
        .pipe(naturalSort())
        .pipe(ngAnnotate())
        .pipe(angularFilesort())
        .pipe(concat('app.js'))
        .pipe(babel({ presets: ['env'] }))
        .pipe(uglify({ mangle: false }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(commons.getBasePath() + '/scripts/'));
});
