var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var expect = require('gulp-expect-file');
var commons = require('./commons.js');
var uglify = require('gulp-uglify');

var SCRIPTS = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/components-jqueryui/jquery-ui.min.js',
    'node_modules/datatables/media/js/jquery.dataTables.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'app/assets/scripts/redactor-2.1.2.4/redactor.js',
    'app/assets/scripts/redactor-2.1.2.4/pt_br.js',
    'app/assets/scripts/redactor-plugins/video.js',
    'app/assets/scripts/redactor-plugins/audio.js',
    'app/assets/scripts/redactor-actions.js',
    'app/assets/scripts/global.js',
    'node_modules/lodash/lodash.js',
    'node_modules/angular/angular.min.js',
    'node_modules/angular-route/angular-route.min.js',
    'node_modules/angular-resource/angular-resource.min.js',
    'node_modules/angular-sanitize/angular-sanitize.min.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/angular-i18n/angular-locale_pt-br.js',
    'node_modules/angular-filter/dist/angular-filter.min.js',
    'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
    'node_modules/angular-translate/dist/angular-translate.min.js',
    'node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    'node_modules/ui-select/dist/select.min.js',
    'node_modules/ng-sortable/dist/ng-sortable.min.js',
    'node_modules/ng-file-upload/dist/ng-file-upload-all.min.js',
    'node_modules/ng-cropperjs/dist/ngCropperjs.min.js',
    'node_modules/angular-ui-mask/dist/mask.min.js',
    'node_modules/angular-datatables/dist/angular-datatables.min.js',
    'node_modules/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js',
    'node_modules/angular-animate/angular-animate.min.js',
    'node_modules/mr-image-mistrall-fork/dist/js/mr-image.min.js',
    'node_modules/log-with-style/log.min.js',
    'node_modules/inflection/inflection.min.js',
    'node_modules/nginflection/dist/ngInflection.min.js',
    'node_modules/ng-tags-input/build/ng-tags-input.min.js',
    'node_modules/angular-ui-sortable/dist/sortable.min.js',
    'node_modules/moment/min/moment.min.js',
    'node_modules/angular-loading-bar/build/loading-bar.min.js',
    'node_modules/angular-cookies/angular-cookies.min.js',
    'node_modules/v-accordion/dist/v-accordion.min.js',
    'node_modules/checklist-model/checklist-model.js',
    'node_modules/angular-input-masks/releases/angular-input-masks-standalone.min.js',
    'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
    'node_modules/nanoscroller/bin/javascripts/jquery.nanoscroller.js',
    'node_modules/ng-scrollbars/dist/scrollbars.min.js',
    'node_modules/dropzone/dist/min/dropzone.min.js',
    'node_modules/ngdropzone/dist/ng-dropzone.min.js',
    'node_modules/angular-ui-calendar/src/calendar.js',
    'node_modules/fullcalendar/dist/fullcalendar.min.js',
    'node_modules/fullcalendar/dist/gcal.min.js',

    // 'bower_components/pdfjs-bower/dist/compatibility.js',
    // 'bower_components/pdfjs-bower/dist/pdf.js'
];

var STYLES = [
    'node_modules/angular-toastr/dist/angular-toastr.min.css',
    'node_modules/font-awesome/css/font-awesome.min.css',
    'node_modules/ng-sortable/dist/ng-sortable.min.css',
    'node_modules/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
    'node_modules/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css',
    // 'bower_components/ng-responsive-calendar/dist/css/calendar.min.css',
    'node_modules/ui-select/dist/select.min.css',
    'node_modules/ng-cropperjs/dist/ngCropperjs.all.min.css',
    'node_modules/animate.css/animate.min.css',
    'node_modules/mr-image-mistrall-fork/dist/css/mr-image.min.css',
    'app/assets/scripts/redactor-2.1.2.4/redactor.css',
    'node_modules/ng-tags-input/build/ng-tags-input.min.css',
    'node_modules/angular-loading-bar/build/loading-bar.min.css',
    'node_modules/v-accordion/dist/v-accordion.min.css',
    'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css',
    'node_modules/nanoscroller/bin/css/nanoscroller.css',
    'node_modules/dropzone/dist/min/dropzone.min.css',
    'node_modules/dropzone/dist/min/basic.min.css',
    'node_modules/ngdropzone/dist/ng-dropzone.min.css',
    'node_modules/fullcalendar/dist/fullcalendar.min.css',

    // God Damn Xenon
    'app/assets/xenon/css/bootstrap.css',
    'app/assets/xenon/css/fonts/linecons/css/linecons.css',
    'app/assets/xenon/css/xenon-core.css',
    'app/assets/xenon/css/xenon-forms.css',
    'app/assets/xenon/css/xenon-components.css',
    'app/assets/xenon/css/xenon-skins.css',
    'app/assets/xenon/css/fileicon.css'
];

var FONTS = [
    'node_modules/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}',
    'node_modules/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}',
    'app/assets/xenon/css/fonts/linecons/font/*.{eot,svg,ttf,woff,woff2}',
];

var BOOTSTRAP_FONTS = [
    'node_modules/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}',
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
        .pipe(uglify({ mangle: false }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(commons.getBasePath() + '/scripts/'));
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
        .pipe(gulp.dest(commons.getBasePath() + '/assets/css/'));
});

gulp.task('build-vendors-bootstrap-fonts', function () {
    gulp.src(BOOTSTRAP_FONTS)
        .pipe(expect({
            errorOnFailure: true
        }, BOOTSTRAP_FONTS))
        .pipe(gulp.dest(commons.getBasePath() + '/assets/css/fonts/glyphicons/'));
});

gulp.task('build-vendors-fonts', function () {
    gulp.src(FONTS)
        .pipe(expect({
            errorOnFailure: true
        }, FONTS))
        .pipe(gulp.dest(commons.getBasePath() + '/assets/fonts/'));
});
