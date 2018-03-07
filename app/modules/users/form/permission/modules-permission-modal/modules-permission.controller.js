(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('ModulesPermissionController', ModulesPermissionController);

    /** ngInject */
    function ModulesPermissionController(WidgetsService, PagesService, Util, NotificationService, dataPermissionModule, currentUser) {
        let vm = this;

        vm.onWidgetSelected = onWidgetSelected;
        vm.onPageSelected = onPageSelected;
        vm.cancel = cancel;
        vm.ok = ok;

        activate();
        
        ////////////////

        function cancel() {
            console.log('cancel');
        }

        function ok() {
            console.log('ok');
        }

        function onWidgetSelected(item) {
            _loadPagesAllowed(item.type);
        }

        function onPageSelected(page) {
            _addPermission(page);
            vm.pageSelected = undefined;
        }

        function _getIndexList(list, item) {
            return list.findIndex(function(eachItem) {
                return eachItem.id === item.id;
            });
        }

        function _addActions(page) {
            page.actions = [
                {
                    buttonTitle: 'Remover',
                    icon: 'fa-trash',
                    eventClick: function(pageToRemove) {
                        _removePermission(pageToRemove);
                    }
                }
            ];
            return page;
        }

        function _loadWidgets() {
            WidgetsService.getWidgets()
                .then(function(data) {
                    vm.widgets = data.data.items;
                    vm.widgetSelected = vm.widgets[0];
                    onWidgetSelected(vm.widgetSelected.type)
                });
        }

        function _addPermission(page) {
            if (!vm.widgetSelected) {
                return;
            }
            _addActions(page);
            let pageAllowed = { id: page.id, title: page.title, actions: page.actions };
            let typeWidget = vm.widgetSelected.type;
            vm.dataPermissions[typeWidget].push(pageAllowed);
        }

        function _removePermission(page) {
            if (!vm.widgetSelected) {
                return;
            }
            let typeWidget = vm.widgetSelected.type;
            let widget = vm.dataPermissions[typeWidget];
            let indexModule = _getIndexList(widget, page);
            widget.splice(indexModule, 1);
        }

        function _loadPagesAllowed(typeModule) {
            if (dataPermissionModule[typeModule]) {
                vm.dataPermissions[typeModule] = vm.dataPermissions[typeModule].map(function(pageAllowed) {
                    return _addActions(pageAllowed);
                });
            } else {
                vm.dataPermissions[typeModule] = [];
            }
        }

         function _initConfigTable() {
            vm.cols = [ { id: 'title', title: 'Titulo' }, { id: 'actions', title: 'Ações' } ];
         }


        function _initVariables() {
            vm.pageSelected;
            vm.widgetSelected;
            vm.dataPermissions = dataPermissionModule;
            vm.currentUser = currentUser;
        }

        function activate() {
            _initVariables();
            _loadWidgets();
            _initConfigTable();
        }
    }
})();