(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ReleaseListService', ReleaseListService);

    /** ngInject */
    function ReleaseListService() {
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
            return _parseWidget(widget);
        }

        function parseToSave(widget) {
            return _parseWidget(widget);
        }

        function _parseWidget(widget) {
            let limit = widget.limit || (widget.content ? widget.content.limit : 0);
            return {
                limit: Number.parseInt(limit)
            };
        }
    }
})();
