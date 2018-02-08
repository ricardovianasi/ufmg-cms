(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ComService', ComService);

    /** ngInject */
    function ComService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            console.log('ComService - load - not implemented', ctrl);

        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }
    }
})();
