;(function () {
  'use strict';

  angular.module('app')
    .run(Run);

  Run.$inject = [
    '$rootScope',
    'dataTableConfigService'
  ];

  function Run($rootScope, dataTableConfigService) {
    $rootScope.dtOptions = dataTableConfigService.init();
  }
})();
