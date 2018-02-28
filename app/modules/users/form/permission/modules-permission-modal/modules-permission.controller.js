(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('ModulesPermissionController', ModulesPermissionController);

    /** ngInject */    
    function ModulesPermissionController(WidgetsService) {
        let vm = this;
        

        activate();

        ////////////////

        function activate() { }
    }
})();