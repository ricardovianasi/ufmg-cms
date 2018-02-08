(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('TagCloudService', TagCloudService);

    /** ngInject */
    function TagCloudService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            console.log('TagCloudService - load - not implemented', ctrl);
        }

        function parseToLoad(widget) {
            return {
                title: widget.title,
                type: widget.type,
                limit: widget.limit || (widget.content ? widget.content.limit : null),
            };
        }

        function parseToSave(widget) {
            return {
                type: widget.type,
                limit: widget.limit || (widget.content ? widget.content.limit : null),
            };
        }
    }
})();
