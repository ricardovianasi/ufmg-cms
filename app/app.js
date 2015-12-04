;(function () {
  'use strict';

  angular
    .module('app', [
      'ngRoute',
      'IndexRouteModule',
      'SidebarDirectiveModule',
      'NavigationServiceModule'
    ]);
})();
