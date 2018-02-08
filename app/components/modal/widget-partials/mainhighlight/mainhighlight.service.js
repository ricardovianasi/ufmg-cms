(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('MainHighLightService', MainHighLightService);

    /** ngInject */
    function MainHighLightService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            console.log('MainHighLightService - load - not implemented', ctrl);
        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }
    }
})();
