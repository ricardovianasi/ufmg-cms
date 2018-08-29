// Gulp File
var requireDir = require('require-dir');

var dir = requireDir('./gulp_tasks', {
    recurse: true
});

var gulp = require('gulp');
var runSequence = require('run-sequence');

// Taks default gulp!
gulp.task('default', function () {
    gulp.start('production');
});

//task for build
gulp.task('build', [
    'env',
    'html',
    'copyimage',
    'css',
    'js',
    'copy-xenon',
    'build-vendors',
    'lang'
]);

//task for developer
gulp.task('serve', function () {
    /*eslint-disable */
    console.log('MODE: production');
    /*eslint-enable */
    return runSequence('build', 'browser-sync', 'watch');
});

//task for prepare deploy
gulp.task('production', function () {
    /*eslint-disable */
    console.log('MODE: production');
    /*eslint-enable */
    return runSequence(['build', 'imagemin']);
});
