var gulp = require('gulp');
var commons = require('./commons.js');

gulp.task('copyimage', function () {
    gulp.src('app/favicon.ico')
        .pipe(gulp.dest(commons.getBasePath()));

    gulp.src('app/assets/css/mCSB_buttons.png')
        .pipe(gulp.dest(commons.getBasePath() + '/assets/css'));

    return gulp.src('./app/assets/images/*.*')
        .pipe(gulp.dest(commons.getBasePath() + '/assets/img'));
});
