var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var expect = require('gulp-expect-file');

var SCRIPTS = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/jquery-ui/jquery-ui.min.js',
  'bower_components/datatables/media/js/jquery.dataTables.js',
  'bower_components/bootstrap/dist/js/bootstrap.min.js',
  'app/assets/scripts/redactor-2/redactor.js',
  'app/assets/scripts/redactor-2/pt_br.js',
  'app/assets/scripts/redactor-plugins/video.js',
  'app/assets/scripts/redactor-plugins/audio.js',
  'app/assets/scripts/redactor-plugins/arquivo.js',
  'bower_components/lodash/dist/lodash.min.js',
  'bower_components/angular/angular.min.js',
  'bower_components/angular-route/angular-route.min.js',
  'bower_components/angular-resource/angular-resource.min.js',
  'bower_components/angular-sanitize/angular-sanitize.min.js',
  'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'bower_components/angular-i18n/angular-locale_pt-br.js',
  'bower_components/angular-filter/dist/angular-filter.min.js',
  'bower_components/angular-toastr/dist/angular-toastr.tpls.min.js',
  'bower_components/angular-translate/angular-translate.min.js',
  'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
  'bower_components/ui-select/dist/select.min.js',
  'bower_components/ng-sortable/dist/ng-sortable.min.js',
  'bower_components/ng-file-upload/ng-file-upload-all.min.js',
  'bower_components/ng-cropper/dist/ngCropper.js',
  'bower_components/angular-ui-mask/dist/mask.min.js',
  'bower_components/angular-datatables/dist/angular-datatables.min.js',
  'bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js',
  'bower_components/angular-animate/angular-animate.min.js',
  'bower_components/mr-image/dist/js/mr-image.min.js',
  'bower_components/ng-lodash/build/ng-lodash.min.js',
  'bower_components/log/log.min.js',
  'bower_components/inflection/inflection.min.js',
  'bower_components/ngInflection/dist/ngInflection.min.js',
  'bower_components/ng-tags-input/ng-tags-input.min.js',
  'bower_components/angular-ui-sortable/sortable.min.js',
];

var STYLES = [
  'bower_components/angular-toastr/dist/angular-toastr.min.css',
  'bower_components/font-awesome/css/font-awesome.min.css',
  'bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
  'bower_components/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css',
  'bower_components/ng-responsive-calendar/dist/css/calendar.min.css',
  'bower_components/ui-select/dist/select.min.css',
  'bower_components/ng-cropper/dist/ngCropper.all.min.css',
  'bower_components/animate.css/animate.min.css',
  'bower_components/mr-image/dist/css/mr-image.min.css',
  'app/assets/scripts/redactor-2/redactor.css',
  'bower_components/ng-tags-input/ng-tags-input.min.css',

  // God Damn Xenon
  'app/assets/xenon/css/bootstrap.css',
  'app/assets/xenon/css/fonts/linecons/css/linecons.css',
  'app/assets/xenon/css/xenon-core.css',
  'app/assets/xenon/css/xenon-forms.css',
  'app/assets/xenon/css/xenon-components.css',
  'app/assets/xenon/css/xenon-skins.css',
];

var FONTS = [
  'bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}',
  'bower_components/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}',
  'app/assets/xenon/css/fonts/linecons/font/*.{eot,svg,ttf,woff,woff2}',
];

var BOOTSTRAP_FONTS = [
  'bower_components/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}',
];

gulp.task('build-vendors', [
  'build-vendors-js',
  'build-vendors-css',
  'build-vendors-fonts',
  'build-vendors-bootstrap-fonts',
]);

gulp.task('build-vendors-js', function () {
  gulp.src(SCRIPTS)
    .pipe(expect({
      errorOnFailure: true
    }, SCRIPTS))
    .pipe(gulpif(/[.]js$/, concat('vendors.js')))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/scripts/'));
});

gulp.task('build-vendors-css', function () {
  gulp.src(STYLES)
    .pipe(expect({
      errorOnFailure: true
    }, STYLES))
    .pipe(gulpif(/[.]css$/, concat('vendors.css')))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/assets/css/'));
});

gulp.task('build-vendors-bootstrap-fonts', function () {
  gulp.src(BOOTSTRAP_FONTS)
    .pipe(expect({
      errorOnFailure: true
    }, BOOTSTRAP_FONTS))
    .pipe(gulp.dest('./build/assets/css/fonts/glyphicons/'));
});

gulp.task('build-vendors-fonts', function () {
  gulp.src(FONTS)
    .pipe(expect({
      errorOnFailure: true
    }, FONTS))
    .pipe(gulp.dest('./build/assets/fonts/'));
});
