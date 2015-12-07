;(function () {
  'use strict';

  angular
    .module('app', [
      'ngRoute',
      'IndexRouteModule',
      'PagesRouteModule',
      'SidebarDirectiveModule',
      'ServiceModule',
      'FilterModule',
      'HelperModule',
      'mediaModule',
      'calendarModule',
      'galleryModule',
      'eventsModule',
      'courseModule',
      'newsModule',
      'releasesModule'
    ]);
})();
