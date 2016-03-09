;(function () {
  'use strict';

  angular
    .module('loginModule')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: 'modules/login/login.template.html',
          controller: 'loginController',
          controllerAs: 'vm'
        });
    }]);
})();
