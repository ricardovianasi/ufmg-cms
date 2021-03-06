(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('WidgetsService', WidgetsService);

    /** ngInject */
    function WidgetsService($http, apiUrl, $uibModal, WidgetModuleService, ServerService) {

        return {
            getWidgets: getWidgets,
            openWidgetModal: openWidgetModal,
            parseListWidgetsToSave: parseListWidgetsToSave
        };

        function openWidgetModal(currentWidget, permissions) {
            let widgetModal = $uibModal.open({
                templateUrl: 'components/modal/module.modal.template.html',
                controller: 'ModuleModalController',
                controllerAs: 'ctrlModal',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    module: function () { return currentWidget; },
                    permissions: function() { return permissions; }
                }
            });
            return widgetModal.result;
        }

        function parseListWidgetsToSave(widgets) {
            let list = widgets.map(function(widget) {
                return _parseWidgetToSave(widget);
            });
            return list;
        }

        function _parseWidgetToSave(widget) {
            var obj = {};

            if (widget) {
                if (widget.id) {
                    obj.id = widget.id;
                }

                obj.type = widget.type;
                obj.title = widget.title;
                var moduleWidget = WidgetModuleService.getWidget(widget.type);
                if(moduleWidget) {
                    angular.extend(obj, moduleWidget.parseToSave(widget));
                }
            }
            return obj;
        }

        function getWidgets() {
            let url = apiUrl + '/widget';
            return ServerService.getLoaded('listWidgets', url, { useLoaded: true });
        }
    }
})();
