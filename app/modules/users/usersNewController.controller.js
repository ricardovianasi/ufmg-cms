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
    'NotificationService',
    'PagesService',
    'PeriodicalService'
  ];

  function usersNewController($rootScope, UsersService, ResourcesService, $routeParams, $location, NotificationService, PagesService, PeriodicalService) {

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
      function: '',
      resourcesPerms: {}
    };

    vm.save = _save;

    vm.convertPrivileges = _convertPrivileges;

    /**
     *
     * @private
     */
    function _getUser() {
      if(id) {
        UsersService.getUser(id).then(function(data){
          vm.user = data.data;
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
      });
    }

    _getPerms();

    /**
     *
     * @private
     */

    // Services to populate selects

    PeriodicalService.getPeriodicals().then(function (data) {
      vm.periodicals = data.data.items;
    });

    PagesService.getPages().then(function(data){
      vm.pagesParent = data.data.items;
    });


    function _convertPrivileges() {

      // recursive function to clone an object. If a non object parameter
      // is passed in, that parameter is returned and no recursion occurs.

      function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
          return obj;
        }

        var temp = obj.constructor(); // give temp the original obj's constructor
        for (var key in obj) {
          temp[key] = cloneObject(obj[key]);
        }

        return temp;
      }

      var clonedPerms = (cloneObject(vm.user.resourcesPerms));

      Object.keys(clonedPerms).forEach(function (k) {
        var innerKeys = Object.keys(clonedPerms[k]), items = [];
        innerKeys.forEach(function(key) {
          items.push((Array.isArray(clonedPerms[k][key]))? key : key + ":" + clonedPerms[k][key]);
        });
        clonedPerms[k] = items.join(";");
      });

      console.log(JSON.stringify(clonedPerms, 0, 4));

      vm.user.permissions = clonedPerms;

    }

    /**
     *
     * @private
     */
    function _save() {
      _convertPrivileges();

      if(id) {
        UsersService.updateUser(vm.user).then(function () {
          $location.path('/users');
          NotificationService.success('Usuário alterado com sucesso!');
        });
      } else {
        UsersService.saveUser(vm.user).then(function () {
          $location.path('/users');
          NotificationService.success('Usuário salvo com sucesso!');
        });
      }

    }


  }

})();
