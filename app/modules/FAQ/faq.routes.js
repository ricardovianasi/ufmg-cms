;(function () {
  'use strict';

  angular.module('faqModule')
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/faq', {
            templateUrl: 'modules/FAQ/faq.template.html',
            controller: 'faqController as vm',
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
          .when('/faq/new', {
            templateUrl: 'modules/FAQ/faq-new.template.html',
            controller: 'faqNewController as vm',
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
          .when('/faq/edit/:faqId', {
            templateUrl: 'modules/FAQ/faq-new.template.html',
            controller: 'faqNewController as vm',
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
