(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('RelatedEventsService', RelatedEventsService);

    /** ngInject */
    function RelatedEventsService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            console.log('RelatedEventsService - load - not implemented', ctrl);
        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }
    }
})();
