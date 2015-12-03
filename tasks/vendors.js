var gulp   = require('gulp'),
	  concat = require('gulp-concat'),
	  rename = require('gulp-rename');

var files = [
	'bower_components/angular/angular.min.js',
	'bower_components/angular-route/angular-route.min.js'
];

gulp.task('build-vendors', function(){
	gulp.src(files)
		.pipe(concat('vendors.js'))
		.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/scripts/'));
});