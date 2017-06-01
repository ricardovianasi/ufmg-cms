var gulp = require('gulp');

gulp.task('copyimage', function () {
    gulp.src('app/favicon.ico')
        .pipe(gulp.dest('./build'));

    gulp.src('app/assets/css/mCSB_buttons.png')
        .pipe(gulp.dest('./build/assets/css'));

    return gulp.src('./app/assets/images/*.*')
        .pipe(gulp.dest('./build/assets/img'));
});
