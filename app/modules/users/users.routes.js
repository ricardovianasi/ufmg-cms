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
          });
      //     .when('/faq/new', {
      //       templateUrl: 'modules/FAQ/faq-new.template.html',
      //       controller: 'faqNewController as vm',
      //       controllerAs: 'ctrl',
      //       resolve: {
      //         isLogged: ['sessionService', function(sessionService) {
      //           return sessionService.getIsLogged();
      //         }]
      //       }
      //     })
      //     .when('/faq/edit/:faqId', {
      //       templateUrl: 'modules/FAQ/faq-new.template.html',
      //       controller: 'faqNewController as vm',
      //       controllerAs: 'ctrl',
      //       resolve: {
      //         isLogged: ['sessionService', function(sessionService) {
      //           return sessionService.getIsLogged();
      //         }]
      //       }
      //     });
        }
    ]);
})();
