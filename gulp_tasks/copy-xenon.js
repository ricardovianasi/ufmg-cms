var gulp = require('gulp');

gulp.task('copy-xenon', function () {
    gulp.src('app/assets/xenon/js/**/*.js')
        .pipe(gulp.dest('./build/assets/js/'));
});
