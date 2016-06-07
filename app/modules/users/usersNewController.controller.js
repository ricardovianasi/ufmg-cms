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

    this.tab = 1;

    this.setTab = function (tabId) {
      this.tab = tabId;
    };

    this.isSet = function (tabId) {
      return this.tab === tabId;
    };



  }

})();
