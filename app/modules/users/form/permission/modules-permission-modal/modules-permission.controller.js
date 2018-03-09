(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('ModulesPermissionController', ModulesPermissionController);

    /** ngInject */
    function ModulesPermissionController($uibModalInstance, $q, WidgetsService, PagesService, NotificationService, dataPermissionModule, currentUser) {
        let vm = this;

        vm.onPageSelected = onPageSelected;
        vm.addPermission = addPermission;
        vm.cancel = cancel;
        vm.ok = ok;

        activate();
        
        ////////////////

        function cancel() {
            console.log('cancel');
            $uibModalInstance.dismiss();
        }

        function ok() {
            console.log('ok', vm.dataPermissions);
            let permissionsToSave = _preparePermissionsToSave();
            $uibModalInstance.close(permissionsToSave);
        }

        function onPageSelected(page) {
            vm.pageSelected = page;
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

        function addPermission() {
            if(!_canAdded(vm.widgetSelected, vm.pageSelected)) {
                return;
            }
            let pageAllowed = _createPermission(vm.pageSelected, vm.widgetSelected);
            vm.dataPermissions.push(pageAllowed);
            _initCrudPermission();
        }

        function _canAdded(widget, page) {
            if (!widget || !page) {
                NotificationService.warn('Você deve selecionar uma página e um widget para adicionar.');
                return false;
            }
            if(_checkAlreadyAdded(widget, page)) {
                NotificationService.warn('Você já adicionou a permissão deste módulo para esta página.');
                return false;
            }
            return true;
        }

        function _checkAlreadyAdded(widget, page) {
            let alreadyAdded = vm.dataPermissions.find(function(permission) {
                return permission.idPage === page.id && permission.module === widget.type;
            });
            return angular.isDefined(alreadyAdded);
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
                nameModule: widget.label,
                permissions: vm.crudPermission
            }
        }

        function _preparePermissions() {
            $q.all([_loadPages(), _loadWidgets()]).then(function() {
                console.log('dataPermissionModule', dataPermissionModule);
                vm.dataPermissions = dataPermissionModule.map(function(permission) {
                    let pageAllowed = vm.allPages.find(function (page) { return page.id === permission.idPage });
                    let moduleAllowed = vm.widgets.find(function (widget) { return widget.type === permission.module });
                    permission.title = pageAllowed.title;
                    permission.nameModule = moduleAllowed.label;
                    return permission;
                });
            });
        }

        function _preparePermissionsToSave() {
            return vm.dataPermissions.map(function(data) {
                delete data.nameModule;
                delete data.title;
                return data;
            });
        }

        function _initConfigTable() {
            vm.configTable = {
                cols: [ 
                    { id: 'title', title: 'Página', type: 'default' },
                    { id: 'nameModule', title: 'Módulo', type: 'default' },
                    { id: 'permissions', title: 'Permissões', type: 'listcheckbox' }
                ],
                actions: [ 
                    { label: 'Remover', icon: 'fa-trash', eventClick: function (permissionToRemove) { _removePermission(permissionToRemove); } } 
                ]
            };
        }

        function _initCrudPermission() {
            vm.pageSelected = undefined;
            vm.crudPermission = [
                { value: false, label: 'Excluir', type: 'delete' },
                { value: false, label: 'Editar', type: 'put' },
                { value: false, label: 'Criar', type: 'create' } 
            ];
        }

        function _initVariables() {
            vm.dataPermissions = [];
            vm.currentUser = currentUser;
            _initCrudPermission();
        }

        function activate() {
            _preparePermissions();
            _initVariables();
            _initConfigTable();
        }
    }
})();