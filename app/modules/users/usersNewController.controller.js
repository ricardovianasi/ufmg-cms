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
    '$timeout',
    '$scope',
    'NotificationService',
    'PagesService',
    'PeriodicalService',
    'CourseService',
    'validationService'
  ];

  function usersNewController($rootScope, UsersService, ResourcesService, $routeParams, $location, $timeout, $scope, NotificationService, PagesService, PeriodicalService, CourseService, validationService) {

    /* jshint ignore:start */
    var vm = this;
    /* jshint ignore:end */

    $rootScope.shownavbar = true;
    console.log('... usersNewController');

    var id = $routeParams.userId;

    ////////////Tabs Handle


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
      status: '1'
    };

    vm.save = _save;
    vm.getPeriodicals = _getPeriodicals;
    vm.getPages = _getPages;
    vm.getGraduation = _getGraduation;
    vm.getMaster = _getMaster;
    vm.getDoctorate = _getDoctorate;
    vm.getSpecialization = _getSpecialization;

    /**
     *
     * @private
     */
    function _getUser() {
      if(id) {
        UsersService.getUser(id).then(function(data){
          vm.user = data.data;
          _convertPrivilegesToLoad();
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

    //////////// Services to populate selects


    //Periodical Editions
    function _getPeriodicals() {
      PeriodicalService.getPeriodicals().then(function (data) {
        vm.periodicals = data.data.items;
      });
    }

    //Pages
    function _getPages() {
      PagesService.getPages().then(function(data){
        vm.pagesParent = data.data.items;
      });
    }

    //Courses - Graduation, Master, Doctorate, Specialization
    function _getGraduation() {
      CourseService.getCourses('graduation').then(function (data) {
        vm.courses_g = data.data.items;
      });
    }

    function _getMaster() {
      CourseService.getCourses('master').then(function (data) {
        vm.courses_m = data.data.items;
      });
    }

    function _getDoctorate() {
      CourseService.getCourses('doctorate').then(function (data) {
        vm.courses_d = data.data.items;
      });
    }

    function _getSpecialization() {
      CourseService.getCourses('specialization').then(function (data) {
        vm.courses_s = data.data.items;
      });
    }

    // _getPeriodicals();
    // _getPages();
    // _getGraduation();
    // _getMaster();
    // _getDoctorate();
    // _getSpecialization();


    ////////////Users service to populate Moderator Select

    UsersService.getUsers().then(function (data) {
      vm.users = data.data.items;
    });


    ////////////Function to convert perms to Load

    function _convertPrivilegesToLoad() {

      var convertedPerms = {};
      var permsToConvert = vm.user.resources_perms;

      Object.keys(permsToConvert).forEach(function(key){

        permsToConvert[key].split(";").forEach(function(value){

          var item = value.split(":");
          var permsToConvert = convertedPerms[key] || {};

          if (item.length > 1) {

            //permsToConvert[item[0]] = isNaN(Number(item[1])) ? item[1] : Number(item[1]);
            permsToConvert[item[0]]=item[1];
            convertedPerms[key] = permsToConvert;

          } else {
            permsToConvert[item[0]] = [item[0]];
            convertedPerms[key] = permsToConvert;
          }

        });
      });

      console.log('MAGIC THE PERM >>>', convertedPerms);
      vm.user.resources_perms = convertedPerms;

    }


    ////////////Function to clone perms Object and parse to save

    function _convertPrivilegesToSave() {

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

      var clonedPerms = (cloneObject(vm.user.resources_perms));

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
      if(!validationService.isValid($scope.formUsers.$invalid))
        return false;

      _convertPrivilegesToSave();

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
