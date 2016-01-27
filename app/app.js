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
      'ngInflection',
      'ngTagsInput',

      // App Modules
      'calendarModule',
      'clippingsModule',
      'componentsModule',
      'courseModule',
      'eventsModule',
      'featuredModule',
      'filterModule',
      'galleryModule',
      'helperModule',
      'indexModule',
      'mediaModule',
      'menuModule',
      'newsModule',
      'pagesModule',
      'periodicalModule',
      'releasesModule',
      'serviceModule',
    ]);
})();
