var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('compress', function () {
    return gulp
        .src(['build/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});
