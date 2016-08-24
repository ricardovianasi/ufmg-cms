;(function () {
  'use strict';

  angular.module('periodicalModule')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/periodicals', {
          templateUrl: 'modules/periodical/periodical.template.html',
          controller: 'PeriodicalController',
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
        .when('/periodicals/new', {
          templateUrl: 'modules/periodical/periodical.form.template.html',
          controller: 'PeriodicalNewController',
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
        .when('/periodicals/edit/:id', {
          templateUrl: 'modules/periodical/periodical.form.template.html',
          controller: 'PeriodicalEditController',
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
        .when('/periodicals/:id/editions', {
          templateUrl: 'modules/periodical/editions/periodical-editions.template.html',
          controller: 'PeriodicalEditionsController',
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
        .when('/periodicals/:id/edition/edit/:edition', {
          templateUrl: 'modules/periodical/editions/periodical-editions.edition.form.template.html',
          controller: 'PeriodicalEditionEditController',
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
        .when('/periodicals/:id/edition/new', {
          templateUrl: 'modules/periodical/editions/periodical-editions.edition.form.template.html',
          controller: 'PeriodicalEditionNewController',
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
    }]);
})();

// articles[][title]
// articles[][subtitle]
// articles[][author_name]
// articles[][thumb]: id de um file
// articles[][cover]: id de um file
// articles[][content]: conteudo em html
// articles[][page_number]
