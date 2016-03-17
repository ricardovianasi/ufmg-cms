;(function () {
  'use strict';

  angular.module('faqModule')
    .controller('faqController', faqController);

  faqController.$inject = [
    '$rootScope'
  ];

  /**
   * @param $scope
   * @param $route
   * @param dataTableConfigService
   * @param EventsService
   * @param DateTimeHelper
   * @param ModalService
   * @param NotificationService
   *
   * @constructor
   */
  function faqController($rootScope) {
    $rootScope.shownavbar = true;
    console.log('... faController');


  }
})();
