;(function(){
  'use strict';

  angular
    .module('clippingsModule')
    .config(['$routeProvider', function ($routeProvider) {

      $routeProvider
        .when('/clippings', {
          templateUrl: 'modules/clippings/clippings.template.html',
          controller: 'ClippingsController',
          controllerAs: 'ctrl'
        })
        .when('/clippings/new', {
          templateUrl: 'modules/clippings/clippings.form.template.html',
          controller: 'ClippingsNewController',
          controllerAs: 'ctrl'
        })
        .when('/clippings/edit/:id', {
          templateUrl: 'modules/clippings/clippings.form.template.html',
          controller: 'ClippingsEditController',
          controllerAs: 'ctrl'
        });
    }]);
})();
