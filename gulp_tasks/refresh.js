var gulp = require('gulp');
var browserSync = require('./browser-sync');

gulp.task('refresh', function () {
    browserSync.reload();
});
