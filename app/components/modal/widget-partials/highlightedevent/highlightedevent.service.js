(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('HighlightedEventService', HighlightedEventService);

    /** ngInject */
    function HighlightedEventService(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(scope) {
            CommonWidgetService.preparingEvents(scope);
        }

        function parseToLoad(widget) {
            return {
                event: widget.event || (widget.content ? widget.content.event : null),
            };
        }

        function parseToSave(widget) {
            return {
                event: (widget.event ? widget.event.id : null) || (widget.content ? widget.content.event.id : null),
            };
        }
    }
})();
