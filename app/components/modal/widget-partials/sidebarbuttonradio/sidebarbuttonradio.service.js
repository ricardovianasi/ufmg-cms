(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('SidebarButtonRadioService', SidebarButtonRadioService);

    /** ngInject */
    function SidebarButtonRadioService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };

        return service;

        ////////////////
        function load() {
        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }

    }
})();
