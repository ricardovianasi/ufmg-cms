var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');

var files = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/jquery/dist/jquery.min.js.map',
  'bower_components/cropper/dist/cropper.min.js',
  'app/assets/scripts/redactor/redactor.js',
  'app/assets/scripts/redactor/pt_br.js',
  'bower_components/lodash/dist/lodash.min.js',
  'bower_components/requirejs/require.js',
  'bower_components/angular/angular.min.js',
  'bower_components/angular/angular.min.js.map',
  'bower_components/angular-route/angular-route.min.js',
  'bower_components/angular-route/angular-route.min.js.map',
  'bower_components/angular-resource/angular-resource.min.js',
  'bower_components/angular-resource/angular-resource.min.js.map',
  'bower_components/angular-sanitize/angular-sanitize.min.js',
  'bower_components/angular-sanitize/angular-sanitize.min.js.map',
  'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'bower_components/angular-filter/dist/angular-filter.min.js',
  'bower_components/angular-toastr/dist/angular-toastr.tpls.min.js',
  'bower_components/ui-select/dist/select.min.js',
  'bower_components/angular-redactor/angular-redactor.js',
  'bower_components/ng-sortable/dist/ng-sortable.min.js',
  'bower_components/ng-file-upload/ng-file-upload-all.min.js',
  'bower_components/ng-cropper/dist/ngCropper.js',
  'bower_components/angular-ui-mask/dist/mask.min.js'
];

var styles = [
  'bower_components/angular-toastr/dist/angular-toastr.min.css',
  'bower_components/font-awesome/css/font-awesome.min.css',
  'bower_components/bootstrap/dist/css/bootstrap.min.css',
  'bower_components/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css',
  'bower_components/ng-responsive-calendar/dist/css/calendar.min.css',
  'bower_components/angular-ui-select/dist/select.min.css',
  'bower_components/cropper/dist/cropper.min.css',
  'bower_components/ng-cropper/dist/ngCropper.all.min.css',
  'app/assets/scripts/redactor/redactor.css'
];

var EXTERNAL_FONTS = [
  'bower_components/font-awesome/fonts/fontawesome-webfont.eot',
  'bower_components/font-awesome/fonts/fontawesome-webfont.svg',
  'bower_components/font-awesome/fonts/fontawesome-webfont.ttf',
  'bower_components/font-awesome/fonts/fontawesome-webfont.woff',
  'bower_components/font-awesome/fonts/fontawesome-webfont.woff2'
];

gulp.task('build-vendors', ['build-vendors-css', 'build-vendors-fonts'], function () {
  gulp.src(files)
    .pipe(gulpif(/[.]js$/, concat('vendors.js')))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/scripts/'));
});

gulp.task('build-vendors-css', function(){
  gulp.src(styles)
    .pipe(gulpif(/[.]css$/, concat('vendors.css')))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/assets/css/'));
});


gulp.task('build-vendors-fonts', function(){
  gulp.src(EXTERNAL_FONTS)
    .pipe(gulp.dest('./build/assets/fonts/'));
});













