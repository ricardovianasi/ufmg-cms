(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('WidgetsService', WidgetsService);

    /** ngInject */
    function WidgetsService($http, $q, apiUrl, $uibModal, WidgetModuleService) {

        let self = this;
        
        _initService();

        return {
            getWidgets: getWidgets,
            openWidgetModal: openWidgetModal,
            parseListWidgetsToSave: parseListWidgetsToSave
        };

        function _initService() {
            self.listWidgets = { items: [] };
        }

        function openWidgetModal(currentWidget) {
            let widgetModal = $uibModal.open({
                templateUrl: 'components/modal/module.modal.template.html',
                controller: 'ModuleModalController',
                controllerAs: 'ctrlModal',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    module: function () { return currentWidget; }
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
            var defer = $q.defer();
            if(self.listWidgets.items.length) {
                defer.resolve(self.listWidgets);
            } else {
                $http.get(apiUrl + '/widget')
                    .then(function (data) {
                        defer.resolve(data.data);
                        self.listWidgets = data.data;
                    })
                    .catch(function(error) {
                        defer.reject(error);
                    });
            }
            return defer.promise;
        }
    }
})();
