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
                permissionsOptions: '<'
            },
        });

    /** ngInject */
    function ControllerController(PermissionService, WidgetsService, ModalService, NotificationService) {
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
                    NotificationService.success('Modulo removido com sucesso.');
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

        function _loadingPermission() {
            if(!ctrl.permissionsOptions) {
                ctrl.canAll = true;
                return;
            }
            let config = ctrl.permissionsOptions;
            let permissionPage = PermissionService.getPermissionModules(config.id, config.keyId, config.context);
            ctrl.modulesPermissions = permissionPage.modules;
            console.log(permissionPage, ctrl.modulesPermissions);
            let canPut = PermissionService.canPutModules(config.context);
            let listPermissionIsVoid = !Object.keys(ctrl.modulesPermissions).length;
            ctrl.canAll = (canPut && listPermissionIsVoid) || config.isAuthor;
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
            _loadingPermission();
        };
        ctrl.$onChanges = function(changesObj) { };
        ctrl.$onDestroy = function() { };
    }
})();