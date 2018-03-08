(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('ModulesPermissionController', ModulesPermissionController);

    /** ngInject */
    function ModulesPermissionController(WidgetsService, $q, PagesService, Util, NotificationService, dataPermissionModule, currentUser) {
        let vm = this;

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

        function onPageSelected(page) {
            _addPermission(page);
            vm.pageSelected = undefined;
        }

        function _getIndexList(list, item) {
            return list.findIndex(function(eachItem) {
                return eachItem.idPage === item.idPage && eachItem.module === item.module;
            });
        }

        function _loadWidgets() {
            return WidgetsService.getWidgets()
                .then(function(data) {
                    vm.widgets = data.data.items;
                });
        }

        function _loadPages() {
            return PagesService.getPages()
                .then(function(data) {
                    vm.allPages = data.data.items;
                });
        }

        function _addPermission(page) {
            if (!vm.widgetSelected) {
                return;
            }
            let pageAllowed = _createPermission(page, vm.widgetSelected);
            vm.dataPermissions.push(pageAllowed);
        }

        function _removePermission(permission) {
            let idxPermission = _getIndexList(vm.dataPermissions, permission);
            vm.dataPermissions.splice(idxPermission, 1);
        }

        function _createPermission(page, widget) {
            return {
                idPage: page.id,
                title: page.title,
                module: widget.type,
                nameModule: widget.label
            }
        }

         function _preparePermissions() {
            $q.all([_loadPages(), _loadWidgets()]).then(function() {
                vm.dataPermissions = dataPermissionModule.map(function(permission) {
                    let pageAllowed = vm.allPages.find(function (page) { return page.id === permission.idPage });
                    let moduleAllowed = vm.widgets.find(function (widget) { return widget.type === permission.module });
                    permission.title = pageAllowed.title;
                    permission.nameModule = moduleAllowed.label;
                    return permission;
                });
            });
         }

         function _initConfigTable() {
            vm.configTable = {
                cols: [ { id: 'title', title: 'Titulo' }, { id: 'nameModule', title: 'Módulo' } ],
                actions: [ 
                    { label: 'Remover', icon: 'fa-trash', eventClick: function (permissionToRemove) { _removePermission(permissionToRemove); } } 
                ]
            };
         }

        function _initVariables() {
            vm.pageSelected;
            vm.widgetSelected;
            vm.dataPermissions = dataPermissionModule;
            vm.currentUser = currentUser;
        }

        function activate() {
            _preparePermissions();
            _initVariables();
            _initConfigTable();
        }
    }
})();