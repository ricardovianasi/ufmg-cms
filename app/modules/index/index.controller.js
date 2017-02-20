(function () {
    'use strict';

    angular
        .module('indexModule')
        .controller('IndexController', IndexController);

    /** ngInject */
    function IndexController($rootScope, $log) {
        $log.info('IndexController');
        $rootScope.shownavbar = true;
    }
})();
