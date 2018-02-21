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
            CommonWidgetService.getTags();
            ctrl.addFullTag = function(tag) {
                addFullTag(ctrl.widget, tag);
            };
        }

        function parseToLoad(widget, ctrl) {
            _preSelectedTag(widget, ctrl);
            let objLoaded = {};
            objLoaded.limit = widget.limit || (widget.content ? widget.content.limit : null);
            objLoaded.tag = widget.content && widget.content.tag ? widget.content.tag.id : widget.tag;
            return objLoaded;
        }

        function parseToSave(widget) {
            let objLoaded = {};
            objLoaded.limit = widget.limit || (widget.content ? widget.content.limit : null);
            objLoaded.tag = widget.tag || (widget.content ? widget.content.tag : null);
            delete widget.fullTag;
            return objLoaded;
        }

        function addFullTag(widget, tag) {
            widget.fullTag = tag;
        }

        function _preSelectedTag(widget, ctrl) {
            if(widget.fullTag) {
                ctrl.dataTags = [widget.fullTag];
            } else if(widget.content) {
                ctrl.dataTags = [widget.content.tag];
            }
        }
    }
})();
