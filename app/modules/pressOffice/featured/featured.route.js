;(function(){
  'use strict';

  angular
    .module('featuredModule')
    .config(['$routeProvider', function ($routeProvider) {

      $routeProvider
        .when('/featured', {
          templateUrl: 'modules/pressOffice/featured/featured.template.html',
          controller: 'featuredController',
          controllerAs: 'vm',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }],
            tokenIsExpired: ['sessionService', '$rootScope', function(sessionService, $rootScope) {
              if(sessionService.verifyTokenIsExpired())
                $rootScope.logout();
            }]
          }
        })
        .when('/featured/new', {
          templateUrl: 'modules/pressOffice/featured/featured.form.template.html',
          controller: 'featuredNewController',
          controllerAs: 'vm',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }],
            tokenIsExpired: ['sessionService', '$rootScope', function(sessionService, $rootScope) {
              if(sessionService.verifyTokenIsExpired())
                $rootScope.logout();
            }]
          }
        })
        .when('/featured/edit/:id', {
          templateUrl: 'modules/pressOffice/featured/featured.form.template.html',
          controller: 'featuredEditController',
          controllerAs: 'vm',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }],
            tokenIsExpired: ['sessionService', '$rootScope', function(sessionService, $rootScope) {
              if(sessionService.verifyTokenIsExpired())
                $rootScope.logout();
            }]
          }
        });
    }]);
})();
