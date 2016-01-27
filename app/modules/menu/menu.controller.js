;(function () {
  'use strict';

  angular.module('menuModule')
    .controller('MenuController', MenuController);

  MenuController.$inject = [
    '$scope',
    'NotificationService',
    'DateTimeHelper',
    'ModalService',
    'PagesService',
  ];

  /**
   * @param $scope
   * @param NotificationService
   * @param DateTimeHelper
   * @param ModalService
   * @param PagesService
   *
   * @constructor
   */
  function MenuController($scope,
                          NotificationService,
                          DateTimeHelper,
                          ModalService,
                          PagesService) {
    console.log('... NoticiasController');

    var vm = this;

    vm.menu = [];
    vm.pages = {};

    PagesService.getPages().then(function (data) {
      vm.pages = data.data;
    });
  }
})();
