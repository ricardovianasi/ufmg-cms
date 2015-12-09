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

      // App Modules
      'componentsModule',
      'filterModule',
      'helperModule',
      'indexModule',
      'pagesModule',
      'periodicalModule',
      'serviceModule',
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
