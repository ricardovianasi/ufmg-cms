(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('ModulesPermissionController', ModulesPermissionController);

    /** ngInject */
    function ModulesPermissionController(WidgetsService, PagesService, Util, dataPermissionModule) {
        let vm = this;

        vm.onWidgetSelected = onWidgetSelected;
        vm.onPageSelected = onPageSelected;

        activate();
        
        ////////////////

        function onWidgetSelected(item) {
            console.log(item);
        }

        function onPageSelected(page) {
            console.log('onPageSelected', page);
            _addActions(page);
            vm.permissionPages.push(page);
        }

        function _addActions(page) {
            page.actions = [
                {
                    buttonTitle: 'Remover',
                    icon: 'fa-trash',
                    eventClick: function(page) {
                        console.log('eventClick', page);
                    }
                }
            ]
        }

        function _initVariables() {
            vm.pageSelected;
            vm.permissionPages = [];
            vm.widgetSelected;
        }

        function _loadWidgets() {
            WidgetsService.getWidgets()
                .then(function(data) {
                    vm.widgets = data.data.items;
                    console.log(data);
                });
        }

         function _initConfigTable() {
            vm.cols = [ { id: 'title', title: 'Titulo' }, { id: 'actions', title: 'Ações' }];
         }

        function activate() {
            _initVariables();
            _loadWidgets();
            _initConfigTable();
        }
    }
})();