(function() {
    'use strict';

    angular
        .module('newMenuModule')
        .controller('MenuHierarchyController', MenuHierarchyController);

        /** ngInject */
    function MenuHierarchyController($uibModalInstance, mainMenu) {
        var vm = this;
        vm.dismiss = dismiss;

        activate();

        ////////////////

        function dismiss() {
            $uibModalInstance.dismiss('Canceled');
        }

        function activate() { 
            vm.mainMenu = mainMenu;
        }
    }
})();