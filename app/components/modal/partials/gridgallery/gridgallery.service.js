(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('GridGalleryService', GridGalleryService);

    /** ngInject */
    function GridGalleryService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            console.log('GridGalleryService - load - not implemented', ctrl);
        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }
    }
})();
