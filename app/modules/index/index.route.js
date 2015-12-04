;(function () {
  'use strict';

  angular
    .module('IndexRouteModule', [
      'ngRoute',
      'IndexControllerModule'
    ])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'modules/index/index.template.html',
          controller: 'IndexController',
          controllerAs: 'ctrl'
        });
    }]);
})();
