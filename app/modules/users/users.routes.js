;(function () {
  'use strict';

  angular.module('usersModule')
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/users', {
            templateUrl: 'modules/users/users.template.html',
            controller: 'usersController as vm',
            controllerAs: 'vm',
            resolve: {
              isLogged: ['sessionService', function(sessionService) {
                return sessionService.getIsLogged();
              }]
            }
          })
          .when('/users/new', {
            templateUrl: 'modules/users/users-new.template.html',
            controller: 'usersNewController as vm',
            controllerAs: 'ctrl',
            resolve: {
              isLogged: ['sessionService', function(sessionService) {
                return sessionService.getIsLogged();
              }]
            }
          }) 
          .when('/user/edit/:userId', {
            templateUrl: 'modules/users/users-new.template.html',
            controller: 'usersNewController as vm',
            controllerAs: 'ctrl',
            resolve: {
              isLogged: ['sessionService', function(sessionService) {
                return sessionService.getIsLogged();
              }]
            }
          });
        }
    ]);
})();
