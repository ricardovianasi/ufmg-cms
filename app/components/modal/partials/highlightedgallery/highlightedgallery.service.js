(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('HighlightedGalleryService', HighlightedGalleryService);

    /** ngInject */
    function HighlightedGalleryService(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            CommonWidgetService.preparingGalleries(ctrl);
        }

        function parseToLoad(widget) {
            return {
                gallery_id: widget.gallery_id || (widget.content ? widget.content.gallery.id : null),
            };
        }

        function parseToSave(widget) {
            return {
                gallery: widget.gallery_id || (widget.content ? widget.content.gallery.id : null),
            };
        }
    }
})();
