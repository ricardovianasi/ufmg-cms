;(function () {
  'use strict';

  angular.module('newsModule')
    .config([
      '$routeProvider', function ($routeProvider) {
        $routeProvider
          .when('/news', {
            templateUrl: 'modules/news/news.template.html',
            controller: 'NewsController',
            controllerAs: 'ctrl',
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
          .when('/news/new', {
            templateUrl: 'modules/news/news.form.template.html',
            controller: 'NewsNewController',
            controllerAs: 'ctrl',
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
          .when('/news/edit/:id', {
            templateUrl: 'modules/news/news.form.template.html',
            controller: 'NewsEditController',
            controllerAs: 'ctrl',
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
      }
    ]);
})();
