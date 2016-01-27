;(function () {
  'use strict';

  angular.module('menuModule')
    .controller('MenuController', MenuController);

  MenuController.$inject = [
    '$scope',
    'NotificationService',
    'DateTimeHelper',
    'ModalService',
  ];

  /**
   * @param $scope
   * @param NotificationService
   * @param DateTimeHelper
   * @param ModalService
   *
   * @constructor
   */
  function MenuController($scope,
                          NotificationService,
                          DateTimeHelper,
                          ModalService) {
    console.log('... NoticiasController');

    $scope.menu = [];
  }
})();
