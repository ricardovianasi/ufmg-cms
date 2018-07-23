var gulp = require('gulp');
var jsonMinify = require('gulp-json-minify');
var commons = require('./commons.js');

gulp.task('lang', function () {
    gulp.src('app/lang/**.*')
        .pipe(jsonMinify())
        .pipe(gulp.dest(commons.getBasePath() + '/lang/'));
});
