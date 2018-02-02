(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ComEventsService', ComEventsService);

    /** ngInject */
    function ComEventsService(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(scope) {
            scope.event = {};
            scope.widget.content = scope.widget.content || {};
            CommonWidgetService.preparingEvents(scope);
        }

        function parseToLoad(widget) {
            return {
                content: widget.content,
                event: {
                    selected: widget.content.event
                },
            };
        }

        function parseToSave(widget) {
            let objToSave = { type: widget.type, event: {} };
            if(widget.content && widget.content.event) {
                objToSave.event = widget.content.event.id;
            }
            return objToSave;
        }
    }
})();