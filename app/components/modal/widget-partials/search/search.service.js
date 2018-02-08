(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('SearchService', SearchService);

    /** ngInject */
    function SearchService(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            CommonWidgetService.preparingPostTypes(ctrl);
        }

        function parseToLoad(widget) {
            let objLoaded = {
                id: widget.id,
                post_type: widget.post_type || (widget.content ? widget.content.post_type : null),
                post_filter_id: _getPostFilter(widget),

            };
            return objLoaded;
        }

        function parseToSave(widget) {
            return {
                id: widget.id,
                post_type: widget.post_type || (widget.content ? widget.content.post_type : null),
                post_filter_id: widget.post_filter_id || (widget.content ? widget.content.post_filter_id : null),
            };
        }

        function _getPostFilter(widget) {
            if (widget.post_filter_id && widget.post_filter_id.length <= 2) {
                return parseInt(widget.post_filter_id);
            } else if(widget.content && widget.content.postFilterId && widget.content.postFilterId.length <= 2) {
                return parseInt(widget.content.postFilterId);
            } else {
                return widget.post_filter_id || (widget.content ? widget.content.postFilterId : null);
            }
        }
    }
})();