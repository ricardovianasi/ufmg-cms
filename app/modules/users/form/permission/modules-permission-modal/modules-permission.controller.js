(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('ModulesPermissionController', ModulesPermissionController);

    /** ngInject */
    function ModulesPermissionController(WidgetsService, PagesService, Util, dataPermissionModule) {
        let vm = this;

        activate();
        
        ////////////////

        function _initVariables() {
            vm.pageSelected;
        }

        function activate() {
            _initVariables();
        }
    }
})();