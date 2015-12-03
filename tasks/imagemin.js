
var gulp   = require('gulp'),
imagemin   = require('gulp-imagemin');

gulp.task('imagemin',function () {
  return gulp.src('./app/assets/img/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/assets/img'));
});