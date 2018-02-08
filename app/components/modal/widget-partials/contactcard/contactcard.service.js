(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ContactCardService', ContactCardService);

    /** ngInject */
    function ContactCardService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            console.log('ContactCardService - load - not implemented', ctrl);
        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }
    }
})();
