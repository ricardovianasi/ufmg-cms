;(function () {
  'use strict';

  angular.module('pagesModule')
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/pages', {
            templateUrl: 'modules/pages/pages.template.html',
            controller: 'PagesController',
            controllerAs: 'ctrl'
          })
          .when('/pages/new', {
            templateUrl: 'modules/pages/pages.form.template.html',
            controller: 'PagesNewController',
            controllerAs: 'ctrl'
          })
          .when('/pages/edit/:id', {
            templateUrl: 'modules/pages/pages.form.template.html',
            controller: 'PagesEditController',
            controllerAs: 'ctrl'
          });
      }
    ]);
})();
