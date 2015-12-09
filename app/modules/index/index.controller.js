;(function () {
  'use strict';

  angular
    .module('indexModule')
    .controller('IndexController', IndexController);

  function IndexController() {
    console.log('... IndexController');
  }
})();
