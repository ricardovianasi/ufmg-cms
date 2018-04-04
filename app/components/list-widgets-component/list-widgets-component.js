(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('componentsModule')
        .component('listWidgetsComponent', {
            templateUrl: 'components/list-widgets-component/list-widgets-component.html',
            controller: ControllerController,
            controllerAs: 'ctrl',
            bindings: {
                setClass: '@',
                idComponent: '@',
                listWidgets: '=',
                viewOnly: '<',
                permissions: '<'
            },
        });

    /** ngInject */
    function ControllerController(WidgetsService, ModalService, NotificationService) {
        var ctrl = this;

        ctrl.openModalWidgets = openModalWidgets;
        ctrl.removeWidget = removeWidget;
        ctrl.isView = isView;
        ctrl.canHandle = canHandle;

        ////////////////

        function removeWidget(widget) {
            let msgModal = 'Você deseja excluir o modulo <b>' + widget.title + '</b>?';
            ModalService.confirm(msgModal, ModalService.MODAL_MEDIUM).result
                .then(function () {
                    let idx = _getIdxFromWidget(widget);
                    ctrl.listWidgets.splice(idx, 1);
                    NotificationService.success('Módulo removido com sucesso.');
                });
        }

        function openModalWidgets(widget) {
            let permissions = ctrl.canAll ? null : ctrl.modulesPermissions;
            WidgetsService.openWidgetModal(widget, permissions)
                .then(function (data) {
                    let idx = _getIdxFromWidget(widget);
                    _updateWidget(data, idx);
                });
        }

        function canHandle(widget, role) {
            let result = false;
            let widgetPermission = _getWidgetPermission(widget.type);
            if(angular.isDefined(widgetPermission) && widgetPermission.permissions) {
                result = widgetPermission.permissions[role];
            }
            return result || ctrl.canAll;
        }

        function isView(widget) {
            return angular.isDefined(_getWidgetPermission(widget.type)) || ctrl.canAll;
        }

        function _getIdxFromWidget(item) {
            return ctrl.listWidgets.findIndex(function(widget) {
                return item == widget;
            });
        }

        function _updateWidget(data, idx) {
            if (idx !== -1) {
                ctrl.listWidgets[idx] = data;
            } else {
                ctrl.listWidgets.push(data);
            }
        }

        function _getWidgetPermission(type) {
            return ctrl.modulesPermissions ? ctrl.modulesPermissions[type] : undefined;
        }

        function _loadPermissionModulesToPost() {
            if(!ctrl.permissions.modules.length) {
                ctrl.canAdd = false;
                return;
            }
            ctrl.canAdd = true;
            ctrl.modulesPermissions = ctrl.permissions.modules.reduce(function(res, item) {
                res[item.type] = { permissions: { post: true, put: true, delete: true } };
                return res;
            }, {});
        }


        function _loadPermissionModulesToPut() {
            ctrl.modulesPermissions = ctrl.permissions.modules || {};
            let listKeysModules = Object.keys(ctrl.modulesPermissions);
            ctrl.canAdd = listKeysModules.reduce(function(result, item) {
                return ctrl.modulesPermissions[item].permissions.post || result;
            }, false);
        }

        function _loadPermission() {
            ctrl.canAll = ctrl.permissions ? ctrl.permissions.isAdmin : false;
            if(!ctrl.permissions && ctrl.canAll) { return; }
            if(ctrl.permissions.isPost) {
                _loadPermissionModulesToPost();
            } else {
                _loadPermissionModulesToPut();
            }

        }

        function _getOptionsSortable() {
            return {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                },
                containment: ctrl.idComponent
            };
        }

        ctrl.$onInit = function() {
            ctrl.sortableOptions = _getOptionsSortable();
            ctrl.canAll = false;
            ctrl.modulesPermissions = {};
            _loadPermission();
        };
        ctrl.$onDestroy = function() { };
    }
})();