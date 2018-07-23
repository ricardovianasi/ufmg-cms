var gulp = require('gulp');
var uglify = require('gulp-uglify');
var commons = require('./commons.js');

gulp.task('compress', function () {
    return gulp
        .src([commons.getBasePath() + '/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest(commons.getBasePath() + '/'));
});
