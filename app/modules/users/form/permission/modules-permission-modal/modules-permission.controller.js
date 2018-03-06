(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('ModulesPermissionController', ModulesPermissionController);

    /** ngInject */
    function ModulesPermissionController(WidgetsService, PagesService, Util, dataPermissionModule) {
        let vm = this;

        vm.onWidgetSelected = onWidgetSelected;

        activate();
        
        ////////////////

        function onWidgetSelected(item) {
            console.log(item);
        }

        function _initVariables() {
            vm.pageSelected;
            vm.widgetSelected;
        }

        function _loadWidgets() {
            WidgetsService.getWidgets()
                .then(function(data) {
                    vm.widgets = data.data.items;
                    console.log(data);
                });
        }

        function activate() {
            _initVariables();
            _loadWidgets();
        }
    }
})();