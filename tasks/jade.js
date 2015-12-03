
var gulp       = require('gulp'),
    minifyHTML = require('gulp-minify-html'),
    jade       = require('gulp-jade'),
    plumber    = require('gulp-plumber');

gulp.task('jade', ['generate-index'], function() {
  var opts = {comments:true};

  gulp.src(['./app/layout/**/*.jade', '!./app/layout/index.jade'])
    .pipe(plumber())
    .pipe(jade({pretty: true}))
    .pipe(minifyHTML())
    .pipe(gulp.dest('./build/'))
});



gulp.task('generate-index', function(){
  gulp.src('./app/layout/index.jade')
    .pipe(plumber())
    .pipe(jade({pretty: true}))
    .pipe(minifyHTML())
    .pipe(gulp.dest('./build/'))
});;
