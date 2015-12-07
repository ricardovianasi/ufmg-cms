;(function(){
  'use strict';

  angular
    .module('clippingsModule')
    .config('$routeProvider', function ($routeProvider) {

      $routeProvider
        .when('/clippings', {
          templateUrl: '/views/clippings.template.html',
          controller: 'ClippingsController',
          controllerAs: 'ctrl'
        })
        .when('/clippings/new', {
          templateUrl: '/views/clippings.form.template.html',
          controller: 'ClippingsNewController',
          controllerAs: 'ctrl'
        })
        .when('/clippings/edit/:id', {
          templateUrl: '/views/clippings.form.template.html',
          controller: 'ClippingsEditController',
          controllerAs: 'ctrl'
        });
    });
})();
