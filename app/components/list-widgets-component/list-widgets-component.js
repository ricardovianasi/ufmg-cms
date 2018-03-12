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

        function removeWidget(idx) {
            let msgModal = 'Você deseja excluir o modulo <b>' + ctrl.listWidgets[idx].title + '</b>?';
            ModalService.confirm(msgModal, ModalService.MODAL_MEDIUM).result
                .then(function () {
                    ctrl.listWidgets.splice(idx, 1);
                    NotificationService.success('Modulo removido com sucesso.');
                });
        }

        function openModalWidgets(idx) {
            let widgetSelected = ctrl.listWidgets[idx];
            WidgetsService.openWidgetModal(widgetSelected)
                .then(function (data) {
                    _updateWidget(data, idx);
                });
        }

        function canHandle(widget, role) {
            let widgetPermission = _getWidgetPermission(widget.type);
            if(angular.isUndefined(widgetPermission)) {
                return false;
            }
            return widgetPermission.permissions[role].value;
        }

        function isView(widget, idx, array) {
            return angular.isDefined(_getWidgetPermission(widget.type));
        }

        function _updateWidget(data, idx) {
            if (typeof idx !== 'undefined') {
                ctrl.listWidgets[idx] = data;
            } else {
                ctrl.listWidgets.push(data);
            }
        }

        function _getWidgetPermission(type) {
            return ctrl.modulesPermissions[type];
        }

        function _loadingPermission() {
            if(!ctrl.permissionsOptions) {
                return;
            }
            let config = ctrl.permissionsOptions;
            ctrl.modulesPermissions = 
                PermissionService.getModulesPermissions(config.id, config.keyId, config.context);
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