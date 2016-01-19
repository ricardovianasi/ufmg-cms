;(function () {
  'use strict';

  angular
    .module('app', [
      // Dependencies
      //'angular-redactor',
      'as.sortable',
      'env',
      'ngAnimate',
      'ngCropper',
      'ngFileUpload',
      'ngRoute',
      'ngSanitize',
      'toastr',
      'ui.bootstrap',
      'ui.select',
      'ui.mask',
      'datatables',
      'datatables.bootstrap',
      'mrImage',
      'ngLodash',

      // App Modules
      'calendarModule',
      'clippingsModule',
      'componentsModule',
      'courseModule',
      'eventsModule',
      'galleryModule',
      'filterModule',
      'helperModule',
      'indexModule',
      'mediaModule',
      'newsModule',
      'pagesModule',
      'periodicalModule',
      'releasesModule',
      'serviceModule',
      'featuredModule'
    ]);
})();
