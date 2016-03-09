;(function () {
  'use strict';

  angular
    .module('loginModule')
    .controller('loginController', loginController);

  loginController.$inject = ['$rootScope'];

  function loginController($rootScope) {
    $rootScope.shownavbar = false;
    console.log('... loginController');
  }
})();
