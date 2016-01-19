;(function(){
  'use strict';

  angular
    .module('featuredModule')
    .config(['$routeProvider', function ($routeProvider) {

      $routeProvider
        .when('/featured', {
          templateUrl: 'modules/featured/featured.template.html',
          // controller: 'featuredModule',
          // controllerAs: 'ctrl'
        })
        .when('/featured/new', {
          templateUrl: 'modules/featured/featured.form.template.html',
          controller: 'featuredNewController',
          controllerAs: 'vm'
        });
        // .when('/featured/edit/:id', {
        //   templateUrl: 'modules/clippings/clippings.form.template.html',
        //   controller: 'ClippingsEditController',
        //   controllerAs: 'ctrl'
        // });
    }]);
})();
