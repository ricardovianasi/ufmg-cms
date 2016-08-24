;(function () {
  'use strict';

  angular.module('galleryModule')
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/galleries', {
            templateUrl: 'modules/gallery/gallery.template.html',
            controller: 'GalleryController',
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
          .when('/gallery/new', {
            templateUrl: 'modules/gallery/gallery.form.template.html',
            controller: 'GalleryNewController',
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
          .when('/gallery/edit/:id', {
            templateUrl: 'modules/gallery/gallery.form.template.html',
            controller: 'GalleryEditController',
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
