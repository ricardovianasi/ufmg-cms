;(function () {
  'use strict';

  angular.module('app')
    .run(Run);

  Run.$inject = [
    '$rootScope',
    'dataTableConfigService',
    'sessionService',
    '$route'
  ];

  function Run($rootScope, dataTableConfigService, sessionService, $route) {
    $rootScope.dtOptions = dataTableConfigService.init();


    /**
     *
     * @private
     */
    $rootScope.logout = function (){
      sessionService.removeToken();
      sessionService.removeIsLogged();
      $route.reload();
    };
  }
})();
