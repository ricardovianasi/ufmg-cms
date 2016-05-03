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
              }]
            }
          });
      }
    ]);
})();
