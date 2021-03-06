var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cssGlobbing = require('gulp-css-globbing');
var cmq = require('gulp-merge-media-queries');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var commons = require('./commons.js');

gulp.task('css', function () {
    gulp.src('./app/assets/**/*.sass')
        .pipe(plumber())
        .pipe(cssGlobbing({
            extensions: ['.scss', '.css', '.sass']
        }))
        // .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', function (error) {
            /*eslint-disable */
            console.log(error);
            /*eslint-enable */
        }))
        .pipe(autoprefixer({
            browsers: ['not ie <= 8'],
            cascade: false
        }))
        .pipe(concat('main.css'))
        .pipe(cmq())
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(commons.getBasePath() + '/assets/css'));
});
