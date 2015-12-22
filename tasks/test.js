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
var expect = require('gulp-expect-file');

var files = [
  // Env
  'app/common/config/env.js',

  // Helpers
  'app/helpers/helper.module.js',
  'app/helpers/datetime.helper.js',

  // Filters
  'app/filters/filter.module.js',
  'app/filters/format.filter.js',
  'app/filters/queryString.filter.js',
  'app/filters/reverse.filter.js',

  // Services
  'app/services/calendar.service.js',
  'app/services/clippings.service.js',
  'app/services/course.service.js',
  'app/services/events.service.js',
  'app/services/gallery.service.js',
  'app/services/media.service.js',
  'app/services/navigation.service.js',
  'app/services/news.service.js',
  'app/services/notification.service.js',
  'app/services/pages.service.js',
  'app/services/periodical.service.js',
  'app/services/releases.service.js',
  'app/services/serialize.service.js',
  'app/services/service.module.js',
  'app/services/status.service.js',
  'app/services/tags.service.js',
  'app/services/upload.service.js',
  'app/services/widgets.service.js',
  'app/services/dataTableConfig.service.js',
  'app/services/tabs.service.js',

  // Components
  'app/components/articles/article.modal.controller.js',
  'app/components/components.module.js',
  'app/components/modules/upload.image.modal.controller.js',
  'app/components/modules/module.modal.controller.js',
  'app/components/publishment/publishment.directive.js',
  'app/components/sidebar/sidebar.controller.js',
  'app/components/sidebar/sidebar.directive.js',
  'app/components/modules/UploadComponentController.controller.js',

  // Modules
  'app/modules/calendar/calendar.controller.js',
  'app/modules/calendar/calendar.module.js',
  'app/modules/calendar/calendar.route.js',
  'app/modules/clippings/clippings.controller.js',
  'app/modules/clippings/clippings.edit.controller.js',
  'app/modules/clippings/clippings.module.js',
  'app/modules/clippings/clippings.new.controller.js',
  'app/modules/clippings/clippings.route.js',
  'app/modules/course/course.controller.js',
  'app/modules/course/course.edit.controller.js',
  'app/modules/course/course.module.js',
  'app/modules/course/course.new.controller.js',
  'app/modules/course/course.route.js',
  'app/modules/events/events.controller.js',
  'app/modules/events/events.edit.controller.js',
  'app/modules/events/events.module.js',
  'app/modules/events/events.new.controller.js',
  'app/modules/events/events.route.js',
  'app/modules/gallery/gallery.controller.js',
  'app/modules/gallery/gallery.edit.controller.js',
  'app/modules/gallery/gallery.module.js',
  'app/modules/gallery/gallery.new.controller.js',
  'app/modules/gallery/gallery.route.js',
  'app/modules/index/index.controller.js',
  'app/modules/index/index.module.js',
  'app/modules/index/index.route.js',
  'app/modules/media/media.controller.js',
  'app/modules/media/media.edit.controller.js',
  'app/modules/media/media.module.js',
  'app/modules/media/media.new.controller.js',
  'app/modules/media/media.route.js',
  'app/modules/news/news.controller.js',
  'app/modules/news/news.edit.controller.js',
  'app/modules/news/news.module.js',
  'app/modules/news/news.new.controller.js',
  'app/modules/news/news.route.js',
  'app/modules/pages/pages.controller.js',
  'app/modules/pages/pages.edit.controller.js',
  'app/modules/pages/pages.module.js',
  'app/modules/pages/pages.new.controller.js',
  'app/modules/pages/pages.route.js',
  'app/modules/periodical/periodical-editions.controller.js',
  'app/modules/periodical/periodical-editions.edition.edit.controller.js',
  'app/modules/periodical/periodical.controller.js',
  'app/modules/periodical/periodical.edit.controller.js',
  'app/modules/periodical/periodical.module.js',
  'app/modules/periodical/periodical.new.controller.js',
  'app/modules/periodical/periodical.route.js',
  'app/modules/releases/releases.controller.js',
  'app/modules/releases/releases.edit.controller.js',
  'app/modules/releases/releases.module.js',
  'app/modules/releases/releases.new.controller.js',
  'app/modules/releases/releases.route.js',

  // Common
  'app/app.js',
  'app/common/config/app.config.js'
];

gulp.task('copy-xenon', function () {
  gulp.src('app/assets/xenon/js/**/*.js')
    .pipe(gulp.dest('./build/assets/js/'));
});

gulp.task('test-js', ['copy-xenon'], function () {
  return gulp.src(files)
    .pipe(plumber())
    .pipe(expect({ errorOnFailure: true }, files))
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
    .pipe(babel({compact: false}))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/scripts/'));
});
