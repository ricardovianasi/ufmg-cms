;(function(){
  'use strict';

  angular
    .module('releasesModule')
    .config(['$routeProvider', function ($routeProvider) {

      $routeProvider
        .when('/releases', {
          templateUrl: 'modules/releases/releases.template.html',
          controller: 'ReleasesController',
          controllerAs: 'ctrl'
        })
        .when('/releases/new', {
          templateUrl: 'modules/releases/releases.form.template.html',
          controller: 'ReleasesNewController',
          controllerAs: 'ctrl'
        })
        .when('/releases/edit/:id', {
          templateUrl: 'modules/releases/releases.form.template.html',
          controller: 'ReleasesEditController',
          controllerAs: 'ctrl'
        });
    }]);
})();
