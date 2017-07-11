var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('watch', function (cb) {
    gulp.watch(['app/**/*.js', '!app/assets/**/*.js'], ['build-js-app']);
    gulp.watch(['app/assets/**/*.js'], ['build-js-vendor']);
    gulp.watch(['app/lang/**.*'], ['build-lang']);
    gulp.watch(['app/**/*.{scss,sass}', 'app/assets/xenon/css/**/*.css'], ['build-sass']);
    gulp.watch(['app/**/*.html'], ['build-html']);
});

gulp.task('build-js-app', function (cb) {
    return runSequence('js', 'refresh', cb);
});

gulp.task('build-js-vendor', function (cb) {
    return runSequence('build-vendors-js', 'refresh', cb);
});

gulp.task('build-lang', function (cb) {
    return runSequence('lang', 'refresh', cb);
});

gulp.task('build-sass', function (cb) {
    return runSequence(['css', 'copy-xenon'], 'refresh', cb);
});

gulp.task('build-html', function (cb) {
    return runSequence('html', 'refresh', cb);
});
