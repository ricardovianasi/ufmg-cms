var gulp = require('gulp'),
		gulpNgConfig = require('gulp-ng-config'),
		fs = require('fs');


gulp.task('env', function () {
	var file;

	fs.stat('app/env-local.json', function(err, stat) {
	  if(err == null)
	  	file = 'env-local.json'
	  else 
	  	file = 'env.json'
	  
	  gulp.src('./app/' + file)
	  	.pipe(gulpNgConfig('env'))
	  	.pipe(gulp.dest('./app/common/config/'))
	});
});