(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('WidgetsService', WidgetsService);

    /** ngInject */
    function WidgetsService($http, $q, apiUrl, $uibModal, WidgetModuleService) {

        return {
            getWidgets: getWidgets,
            openWidgetModal: openWidgetModal,
            parseListWidgetsToSave: parseListWidgetsToSave
        };

        function openWidgetModal(listWidgets, currentWidget) {
            let widgetModal = $uibModal.open({
                templateUrl: 'components/modal/module.modal.template.html',
                controller: 'ModuleModalController',
                controllerAs: 'ctrlModal',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    module: function () { return currentWidget; },
                    widgets: function () { return listWidgets; }
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
                angular.extend(obj, WidgetModuleService.getWidget(widget.type).parseToSave(widget));
            }
            return obj;
        }

        function getWidgets() {
            var deferred = $q.defer();

            $http
                .get(apiUrl + '/widget')
                .then(function (data) {
                    deferred.resolve(data);
                });

            return deferred.promise;
        }
    }
})();
