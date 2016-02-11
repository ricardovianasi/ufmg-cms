var gulp = require('gulp');

gulp.task('watch', function () {
  gulp.watch('app/**/*.js', [
    'js',
    'refresh'
  ]);
  gulp.watch('app/lang/**.*', [
    'lang',
    'refresh'
  ]);
  gulp.watch(['app/assets/styles/**/*.{scss,sass}', 'app/assets/xenon/css/**/*.css'], [
    'css',
    'copy-xenon',
    'refresh'
  ]);
  gulp.watch('app/**/*.html', [
    'html',
    'refresh'
  ]);
});
