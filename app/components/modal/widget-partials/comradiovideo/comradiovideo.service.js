(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ComRadioVideoService', ComRadioVideoService);

    /** ngInject */
    function ComRadioVideoService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            console.log('ComRadioVideoService - load - not implemented', ctrl);
        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }
    }
})();
