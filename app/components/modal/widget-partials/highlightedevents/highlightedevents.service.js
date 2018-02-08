(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('HighlightedEventsService', HighlightedEventsService);

    /** ngInject */
    function HighlightedEventsService(CommonWidgetService) {
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
            let objLoad = { events: [] };
            if (widget.events) {
                objLoad.events = widget.events;
            } else if(widget.content && widget.content.events) {
                objLoad.events = widget.content.events;
            }
            return objLoad;
        }

        function parseToSave(widget) {
            let objLoad = {events: []};
            if (widget.events) {
                angular.forEach(widget.events, function (event) {
                    objLoad.events.push(event.id);
                });
            } else if(widget.content && widget.content.events) {
                angular.forEach(widget.content.events, function (event) {
                    objLoad.events.push(event.id);
                });
            }
            return objLoad;
        }
    }
})();
