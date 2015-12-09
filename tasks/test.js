var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var angularFilesort = require('gulp-angular-filesort');
var naturalSort = require('gulp-natural-sort');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');

var files = [
  "app/common/config/env-production.js",
  "app/helpers/helperModule.js",
  "app/helpers/datetime.helper.js",
  "app/filters/filterModule.js",
  "app/filters/format.filter.js",
  "app/filters/reverse.filter.js",
  "app/services/serviceModule.js",
  "app/services/navigation.service.js",
  "app/services/periodical.service.js",
  "app/services/notification.service.js",
  "app/services/status.service.js",
  "app/services/serialize.service.js",
  "app/services/media.service.js",
  "app/components/components.module.js",
  "app/components/modules/module.modal.controller.js",
  "app/components/sidebar/sidebar.controller.js",
  "app/components/sidebar/sidebar.directive.js",
  "app/modules/periodical/periodical.module.js",
  "app/modules/periodical/periodical.route.js",
  "app/modules/periodical/periodical.controller.js",
  "app/modules/periodical/periodical.edit.controller.js",
  "app/modules/periodical/periodical.new.controller.js",
  "app/modules/periodical/periodical-editions.controller.js",
  "app/modules/periodical/periodical-editions.edition.edit.controller.js",
  "app/modules/index/index.module.js",
  "app/modules/index/index.route.js",
  "app/modules/index/index.controller.js",
  "app/app.js",
  "app/common/config/app.config.js"
];



gulp.task('test-js', function () {
  return gulp.src(files)
    .pipe(plumber())
    .pipe(jshint({
      esnext: true,
      strict: true
    }))
    .pipe(jshint.reporter(stylish))
    .pipe(naturalSort())
    .pipe(angularFilesort())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/scripts/'));
});
