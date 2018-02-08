(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ComHubService', ComHubService);

    /** ngInject */
    function ComHubService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            console.log('ComHubService - load - not implemented', ctrl);

        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }
    }
})();
