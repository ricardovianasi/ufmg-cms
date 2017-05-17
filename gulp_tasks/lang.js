var gulp = require('gulp');
var jsonMinify = require('gulp-json-minify');

gulp.task('lang', function () {
    gulp.src('app/lang/**.*')
        .pipe(jsonMinify())
        .pipe(gulp.dest('./build/lang/'));
});
