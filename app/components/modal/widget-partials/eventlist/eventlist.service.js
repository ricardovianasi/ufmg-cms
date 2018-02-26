(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('EventListService', EventListService);

    /** ngInject */
    function EventListService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load() { }

        function parseToLoad(widget) {
            let objLoaded = {};
            objLoaded.limit = widget.limit || (widget.content ? widget.content.limit : null);
            objLoaded.tag = _getTag(widget);
            return objLoaded;
        }

        function parseToSave(widget) {
            let objLoaded = {};
            objLoaded.limit = widget.limit || (widget.content ? widget.content.limit : null);
            objLoaded.tag = _parseTagToSave(widget);
            return objLoaded;
        }

        function _parseTagToSave(widget) {
            if(widget.tag) {
                return widget.tag[0].text;
            } else if(widget.content) {
                return widget.content.tag || null;
            }
        }

        function _getTag(widget) {
            if(widget.tag && widget.tag.length > 0) {
                return widget.tag;
            } else if(widget.content) {
                return widget.content.tag ? [widget.content.tag.name] : [widget.tag];
            }
        }
    }
})();
