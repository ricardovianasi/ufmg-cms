(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('InstagramLastImageService', InstagramLastImageService);

    /** ngInject */
    function InstagramLastImageService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            ctrl.widget = { };
        }

        function parseToLoad(widget) {
            return widget;
        }

        function parseToSave(widget) {
            return widget;
        }
    }
})();
