;(function () {
  'use strict';

  angular.module('usersModule')
    .controller('usersNewController', usersNewController);

  usersNewController.$inject = [
    '$rootScope',
    'UsersService',
    'ResourcesService',
    '$routeParams',
    '$location',
    'NotificationService'
  ];

  function usersNewController($rootScope, UsersService, ResourcesService, $routeParams, $location, NotificationService) {

    /* jshint ignore:start */
    var vm = this;
    /* jshint ignore:end */

    $rootScope.shownavbar = true;
    console.log('... usersNewController');

    var id = $routeParams.userId;

    //Tabs Handle

    vm.tab = 1;

    vm.setTab = function (tabId) {
      vm.tab = tabId;
    };

    vm.isSet = function (tabId) {
      return vm.tab === tabId;
    };

    vm.user = {
      name: '',
      email: '',
      site: '',
      commercial_phone: '',
      home_phone: '',
      mobile_phone: '',
      unit: '',
      sector: '',
      occupation: '',
      function: ''
    };

    vm.save = _save;

    /**
     *
     * @private
     */
    function _getUser() {
      if(id) {
        UsersService.getUser(id).then(function(data){
          vm.user = data.data;

          console.log('data >>>>>>>>>>>>', data.data.items);

        });
      }
    }

    _getUser();


    /**
     *
     * @private
     */
    function _getPerms() {
      ResourcesService.get().then(function(data){
        vm.resources = data.data.items; 

        console.log('data perms >>>>>>>>>>>>', data.data.items);

      });
    }

    _getPerms();


    /**
     *
     * @private
     */
    function _save() {

      if(id) {
        UsersService.updateUser(vm.user).then(function () {
          $location.path('/user');
          NotificationService.success('Usuário alterado com sucesso!');
        });
      } else {
        UsersService.saveUser(vm.user).then(function () {
          $location.path('/user');
          NotificationService.success('Usuário salvo com sucesso!');
        });
      }

    }


  }

})();
