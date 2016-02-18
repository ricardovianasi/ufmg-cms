;(function(){
  'use strict';

  angular
    .module('clippingsModule')
    .config(['$routeProvider', function ($routeProvider) {

      $routeProvider
        .when('/clippings', {
          templateUrl: 'modules/press-office/clippings/clippings.template.html',
          controller: 'ClippingsController',
          controllerAs: 'ctrl'
        })
        .when('/clippings/new', {
          templateUrl: 'modules/press-office/clippings/clippings.form.template.html',
          controller: 'ClippingsNewController',
          controllerAs: 'ctrl'
        })
        .when('/clippings/edit/:id', {
          templateUrl: 'modules/press-office/clippings/clippings.form.template.html',
          controller: 'ClippingsEditController',
          controllerAs: 'ctrl'
        });
    }]);
})();
