var gulp = require('gulp');
var spawn = require('child_process').spawn;

// Taks default gulp!
gulp.task('default', function () {
  gulp.start('dev');
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
gulp.task('dev', [
  'build',
  'watch',
  'browser-sync'
]);

//task for prepare deploy
gulp.task('production', [
  'build',
  'imagemin'
]);

gulp.task('auto-reload', function () {
  var p;

  gulp.watch(['gulpfile.js', 'tasks/*.js'], spawnChildren);
  spawnChildren();

  function spawnChildren(e) {
    // kill previous spawned process
    if (p) {
      p.kill();
    }

    // `spawn` a child `gulp` process linked to the parent `stdio`
    p = spawn('gulp', ['default'], {
      stdio: 'inherit'
    });
  }
});
