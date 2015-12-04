;(function () {
  'use strict';

  angular.module('PagesRouteModule', [
      'ngRoute',
      'PagesControllerModule',
      'PagesNewControllerModule',
      'PagesEditControllerModule'
    ])
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/pages', {
            templateUrl: '/views/pages.template.html',
            controller: 'PagesController',
            controllerAs: 'ctrl'
          })
          .when('/pages/new', {
            templateUrl: '/views/pages.form.template.html',
            controller: 'PagesNewController',
            controllerAs: 'ctrl'
          })
          .when('/pages/edit/:id', {
            templateUrl: '/views/pages.form.template.html',
            controller: 'PagesEditController',
            controllerAs: 'ctrl'
          });
      }
    ]);
})();
