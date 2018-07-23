var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var commons = require('./commons.js');

gulp.task('imagemin', function () {
    return gulp.src('./app/assets/img/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(commons.getBasePath() + '/assets/img'));
});
