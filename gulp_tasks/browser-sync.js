var gulp = require('gulp');
var commons = require('./commons.js');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: commons.getBasePath() + '/',
        },
        port: commons.getPort()
    });
});

module.exports = browserSync;

