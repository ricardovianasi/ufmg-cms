var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var expect = require('gulp-expect-file');

var files = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/datatables/media/js/jquery.dataTables.js',
  'bower_components/bootstrap/dist/js/bootstrap.min.js',
  'bower_components/cropper/dist/cropper.min.js',
  'app/assets/scripts/redactor/redactor.js',
  'app/assets/scripts/redactor/pt_br.js',
  'bower_components/lodash/lodash.min.js',
  'bower_components/angular/angular.min.js',
  'bower_components/angular-route/angular-route.min.js',
  'bower_components/angular-resource/angular-resource.min.js',
  'bower_components/angular-sanitize/angular-sanitize.min.js',
  'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'bower_components/angular-filter/dist/angular-filter.min.js',
  'bower_components/angular-toastr/dist/angular-toastr.tpls.min.js',
  'bower_components/ui-select/dist/select.min.js',
  'bower_components/angular-redactor/angular-redactor.js',
  'bower_components/ng-sortable/dist/ng-sortable.min.js',
  'bower_components/ng-file-upload/ng-file-upload-all.min.js',
  'bower_components/ng-cropper/dist/ngCropper.js',
  'bower_components/angular-ui-mask/dist/mask.min.js',
  'bower_components/angular-datatables/dist/angular-datatables.min.js',
  'bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js',
];

var styles = [
  'bower_components/angular-toastr/dist/angular-toastr.min.css',
  'bower_components/font-awesome/css/font-awesome.min.css',
  'bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
  'bower_components/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css',
  'bower_components/ng-responsive-calendar/dist/css/calendar.min.css',
  'bower_components/ui-select/dist/select.min.css',
  'bower_components/cropper/dist/cropper.min.css',
  'bower_components/ng-cropper/dist/ngCropper.all.min.css',
  'app/assets/scripts/redactor/redactor.css',

  // God Damn Xenon
  'app/assets/xenon/css/bootstrap.css',
  'app/assets/xenon/css/fonts/linecons/css/linecons.css',
  'app/assets/xenon/css/xenon-core.css',
  'app/assets/xenon/css/xenon-forms.css',
  'app/assets/xenon/css/xenon-components.css',
  'app/assets/xenon/css/xenon-skins.css'
];

var EXTERNAL_FONTS = [
  'bower_components/font-awesome/fonts/fontawesome-webfont.eot',
  'bower_components/font-awesome/fonts/fontawesome-webfont.svg',
  'bower_components/font-awesome/fonts/fontawesome-webfont.ttf',
  'bower_components/font-awesome/fonts/fontawesome-webfont.woff',
  'bower_components/font-awesome/fonts/fontawesome-webfont.woff2',
  'bower_components/bootstrap/fonts/glyphicons-halflings-regular.eot',
  'bower_components/bootstrap/fonts/glyphicons-halflings-regular.svg',
  'bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf',
  'bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff',
  'bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2',
  'app/assets/xenon/css/fonts/linecons/font/linecons.eot',
  'app/assets/xenon/css/fonts/linecons/font/linecons.svg',
  'app/assets/xenon/css/fonts/linecons/font/linecons.ttf',
  'app/assets/xenon/css/fonts/linecons/font/linecons.woff'
];

gulp.task('build-vendors', ['build-vendors-css', 'build-vendors-fonts'], function () {
  gulp.src(files)
    .pipe(expect({ errorOnFailure: true }, files))
    .pipe(gulpif(/[.]js$/, concat('vendors.js')))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/scripts/'));
});

gulp.task('build-vendors-css', function(){
  gulp.src(styles)
    .pipe(expect({ errorOnFailure: true }, styles))
    .pipe(gulpif(/[.]css$/, concat('vendors.css')))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/assets/css/'));
});

gulp.task('build-vendors-fonts', function(){
  gulp.src(EXTERNAL_FONTS)
    .pipe(expect({ errorOnFailure: true }, EXTERNAL_FONTS))
    .pipe(gulp.dest('./build/assets/fonts/'));
});
