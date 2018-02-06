(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('EventListService', EventListService);

    /** ngInject */
    function EventListService(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            CommonWidgetService.getTags(ctrl);
        }

        function parseToLoad(widget) {
            return {
                limit: widget.limit || (widget.content ? widget.content.limit : null),
                tag: widget.content ? widget.content.tag.id : widget.tag,
            };
        }

        function parseToSave(widget) {
            return {
                limit: widget.limit || (widget.content ? widget.content.limit : null),
                tag: widget.tag || (widget.content ? widget.content.tag : null),
            };
        }
    }
})();
