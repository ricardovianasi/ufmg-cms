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
        function load(scope) {
            scope.widget = { };
        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }
    }
})();
