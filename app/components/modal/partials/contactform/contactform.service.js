(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ContactFormService', ContactFormService);

    /** ngInject */
    function ContactFormService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            console.log('ContactFormService - load - not implemented', ctrl);
        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }
    }
})();
