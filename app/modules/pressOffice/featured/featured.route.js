;(function(){
  'use strict';

  angular
    .module('featuredModule')
    .config(['$routeProvider', function ($routeProvider) {

      $routeProvider
        .when('/featured', {
          templateUrl: 'modules/pressOffice/featured/featured.template.html',
          controller: 'featuredController',
          controllerAs: 'vm'
        })
        .when('/featured/new', {
          templateUrl: 'modules/pressOffice/featured/featured.form.template.html',
          controller: 'featuredNewController',
          controllerAs: 'vm'
        })
        .when('/featured/edit/:id', {
          templateUrl: 'modules/pressOffice/featured/featured.form.template.html',
          controller: 'featuredEditController',
          controllerAs: 'vm'
        });
    }]);
})();
