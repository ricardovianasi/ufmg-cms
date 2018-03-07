(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('ModulesPermissionController', ModulesPermissionController);

    /** ngInject */
    function ModulesPermissionController(WidgetsService, PagesService, Util, NotificationService, dataPermissionModule) {
        let vm = this;

        vm.onWidgetSelected = onWidgetSelected;
        vm.onPageSelected = onPageSelected;

        activate();
        
        ////////////////

        function onWidgetSelected(item) {
            console.log(item);
        }

        function onPageSelected(page) {
            _addActions(page);
            _addPage(page);
            vm.pageSelected = undefined;
        }
        
        function _addPage(page) {
            let idxPage = _getIndexPage(page);
            if(idxPage === -1) {
                vm.listAllowedPages.push(page);
            } else {
                NotificationService.warn('Esta pagina já foi inserida.');
            }
        }

        function _removePage(page) {
            let idxPage = _getIndexPage(page);
            if(idxPage !== -1) {
                vm.listAllowedPages.splice(idxPage, 1);
            }
        }

        function _getIndexPage(page) {
            return vm.listAllowedPages.findIndex(function(pg) {
                return pg.id === page.id;
            });
        }

        function _addActions(page) {
            page.actions = [
                {
                    buttonTitle: 'Remover',
                    icon: 'fa-trash',
                    eventClick: function(pageToRemove) {
                        _removePage(pageToRemove);
                    }
                }
            ]
        }

        function _initVariables() {
            vm.pageSelected;
            vm.listAllowedPages = [];
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