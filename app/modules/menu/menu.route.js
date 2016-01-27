;(function () {
  'use strict';

  angular.module('menuModule')
    .config(MenuModule);

  MenuModule.$inject = [
    '$routeProvider',
  ];

  /**
   * @param $routeProvider
   *
   * @constructor
   */
  function MenuModule($routeProvider) {
    $routeProvider
      .when('/menu', {
        templateUrl: 'modules/menu/menu.template.html',
        controller: 'MenuController',
        controllerAs: 'ctrl'
      });
  }
})();
