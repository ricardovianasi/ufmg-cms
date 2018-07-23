var gulp = require('gulp');
var commons = require('./commons.js');

gulp.task('copy-xenon', function () {
    gulp.src('app/assets/xenon/js/**/*.js')
        .pipe(gulp.dest(commons.getBasePath() + '/assets/js/'));
});
