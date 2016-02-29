;(function(){
  'use strict';

  angular
    .module('releasesModule')
    .config(['$routeProvider', function ($routeProvider) {

      $routeProvider
        .when('/releases', {
          templateUrl: 'modules/pressOffice/releases/releases.template.html',
          controller: 'ReleasesController',
          controllerAs: 'ctrl'
        })
        .when('/releases/new', {
          templateUrl: 'modules/pressOffice/releases/releases.form.template.html',
          controller: 'ReleasesNewController',
          controllerAs: 'ctrl'
        })
        .when('/releases/edit/:id', {
          templateUrl: 'modules/pressOffice/releases/releases.form.template.html',
          controller: 'ReleasesEditController',
          controllerAs: 'ctrl'
        });
    }]);
})();
