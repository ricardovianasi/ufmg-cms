;(function(){
  'use strict';

  angular.module('mediaModule')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/media', {
          templateUrl: 'modules/media/media.template.html',
          controller: 'MediaController',
          controllerAs: 'ctrl',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        })
        .when('/media/new', {
          templateUrl: 'modules/media/media.form.template.html',
          controller: 'MediaNewController',
          controllerAs: 'ctrl',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        })
        .when('/media/edit/:id', {
          templateUrl: 'modules/media/media.form.template.html',
          controller: 'MediaEditController',
          controllerAs: 'ctrl',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        });
    }]);
})();
