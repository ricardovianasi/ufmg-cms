(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('WidgetsService', WidgetsService);

    /** ngInject */
    function WidgetsService($http, $q, apiUrl, $uibModal) {

        return {
            getWidgets: _getWidgets,
            openWidgetModal: openWidgetModal
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

        function _getWidgets() {
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
