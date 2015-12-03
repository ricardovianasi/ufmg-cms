var gulp   = require('gulp');


// Taks default gulp! 
gulp.task('default', function(){
	gulp.start('dev');
});


//task for build 
gulp.task('build', [
          'jade',
          'copyimage',
          'css',
          'js',
          'build-vendors']);



//task for developer
gulp.task('dev', [
          'env',
          'build',
          'watch',
          'browser-sync']);


//task for prepare deploy
gulp.task('production',[
          'env',
          'build',
          'imagemin']);