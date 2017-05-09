(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('tabsService', tabsService);

    /** ngInject */
    function tabsService($log) {
        $log.info('TabsService');

        var tabs = {
            home: true,
            midia: false,
            crop: false
        };

        return {
            getTabs: _getTabs,
            selectTab: _selectTab
        };

        function _getTabs() {
            return tabs;
        }

        function _selectTab(nextTab) {
            angular.forEach(tabs, function (value, key) {
                tabs[key] = key === nextTab;
            });
        }
    }
})();
