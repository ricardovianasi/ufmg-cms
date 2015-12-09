;(function () {
  'use strict';

  angular
    .module('app', [
      // Dependencies
      'angular-redactor',
      'as.sortable',
      'env',
      'ngCropper',
      'ngFileUpload',
      'ngRoute',
      'ngSanitize',
      'toastr',
      'ui.bootstrap',
      'ui.select',
      'ui.mask',

      // App Modules
      'componentsModule',
      'filterModule',
      'helperModule',
      'indexModule',
      'pagesModule',
      'periodicalModule',
      'serviceModule',
      'releasesModule',
      // 'PagesRouteModule',
      // 'SidebarDirectiveModule',
      // 'serviceModule',
      // 'filterModule',
      // 'helperModule',
      // 'mediaModule',
      // 'calendarModule',
      // 'galleryModule',
      // 'eventsModule',
      // 'courseModule',
      // 'newsModule',
      // 'releasesModule',
      // 'periodicalModule',
      // 'clippingsModule'
    ]);
})();
