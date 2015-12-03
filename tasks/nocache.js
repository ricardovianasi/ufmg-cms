var gulp   = require('gulp'),
CacheBuster = require('gulp-cachebust');
 
var cachebust = new CacheBuster();


gulp.task('nocache-css', function () {
    return gulp.src('public/assets/css/main.min.css')
        // Awesome css stuff 
        .pipe(cachebust.resources())
        .pipe(gulp.dest('public/assets/css/'));
});

gulp.task('nocache-js', function () {
    return gulp.src('public/scripts/app.min.js')
        // Awesome css stuff 
        .pipe(cachebust.resources())
        .pipe(gulp.dest('public/scripts/'));
});

gulp.task('nocache-vendors', function () {
    return gulp.src('public/scripts/vendors.min.js')
        // Awesome css stuff 
        .pipe(cachebust.resources())
        .pipe(gulp.dest('public/scripts/'));
});

gulp.task('nocache', ['nocache-css', 'nocache-js', 'nocache-vendors'], function () {
    return gulp.src('public/index.html')
        // Awesome html stuff 
        .pipe(cachebust.references())
        .pipe(gulp.dest('public/'));
});