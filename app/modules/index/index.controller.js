;(function () {
  'use strict';

  angular
    .module('indexModule')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$rootScope'];

  function IndexController($rootScope) {
    console.log('... IndexController');
    $rootScope.shownavbar = true;
  }
})();
