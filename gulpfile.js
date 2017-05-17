var requireDir = require('require-dir');

var dir = requireDir('./gulp_tasks', {
    recurse: true
});

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');

// Taks default gulp!
gulp.task('default', function () {
    gulp.start('production');
});

//task for build
gulp.task('production', [
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
    console.log('MODE: serve');
    /*eslint-enable */
    return runSequence('production', 'browser-sync', 'watch');
});

//task for prepare deploy
gulp.task('build', function () {
    /*eslint-disable */
    console.log('MODE: deploy production');
    /*eslint-enable */
    return runSequence(['production', 'imagemin'], 'compress');
});
