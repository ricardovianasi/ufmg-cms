;(function () {
  'use strict';

  angular.module('usersModule')
    .controller('usersNewController', usersNewController);

  usersNewController.$inject = [
    '$rootScope',
    'UsersService',
    'NotificationService',
  ];

  function usersNewController($rootScope, UsersService, NotificationService) {

    /* jshint ignore:start */
    var vm = this;
    /* jshint ignore:end */

    $rootScope.shownavbar = true;
    console.log('... usersNewController');

    vm.tab = 1;

    vm.setTab = function (tabId) {
      vm.tab = tabId;
    };

    vm.isSet = function (tabId) {
      return vm.tab === tabId;
    };



  }

})();
