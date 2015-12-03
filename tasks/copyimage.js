var gulp = require('gulp');

gulp.task('copyimage', function () {
  return gulp.src('./app/assets/img/*.*')
    .pipe(gulp.dest('./build/assets/img'));
});
