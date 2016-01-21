;(function(){
  'use strict';

  angular
    .module('app')
    .run(run);


    run.$inject = ['$rootScope', 'dataTableConfigService'];

    function run($rootScope, dataTableConfigService){
      $rootScope.dtOptions = dataTableConfigService.init();
    }
})();
