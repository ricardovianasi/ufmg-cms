;(function(){
  'use strict';

  angular
    .module('clippingsModule')
    .config(['$routeProvider', function ($routeProvider) {

      $routeProvider
        .when('/clippings', {
          templateUrl: 'modules/pressOffice/clippings/clippings.template.html',
          controller: 'ClippingsController',
          controllerAs: 'ctrl',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        })
        .when('/clippings/new', {
          templateUrl: 'modules/pressOffice/clippings/clippings.form.template.html',
          controller: 'ClippingsNewController',
          controllerAs: 'ctrl',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        })
        .when('/clippings/edit/:id', {
          templateUrl: 'modules/pressOffice/clippings/clippings.form.template.html',
          controller: 'ClippingsEditController',
          controllerAs: 'ctrl',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        });
    }]);
})();
