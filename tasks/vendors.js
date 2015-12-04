var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');

var files = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/jquery/dist/jquery.min.js.map',
  'bower_components/cropper/dist/cropper.min.js',
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
  'bower_components/angular-ui-select/dist/select.min.js',
  'bower_components/angular-redactor/angular-redactor.js',
  'bower_components/ng-sortable/dist/ng-sortable.min.js',
  'bower_components/ng-file-upload/ng-file-upload-all.min.js',
  'bower_components/ng-cropper/dist/ngCropper.js',
  'bower_components/angular-ui-mask/dist/mask.min.js'
];

gulp.task('build-vendors', function () {
  gulp.src(files)
    .pipe(gulpif(/[.]js$/, concat('vendors.js')))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/scripts/'));
});
