(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('HighlightedGalleriesService', HighlightedGalleriesService);

    /** ngInject */
    function HighlightedGalleriesService(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            CommonWidgetService.prepareItems(ctrl);
            CommonWidgetService.preparingGalleries(ctrl);
        }

        function parseToLoad(widget) {
            // var galleriesToSelect = [];
            //     angular.forEach(widget.content.galleries, function (gallery) {
            //       galleriesToSelect.push(gallery.id);
            //     });
            //     _obj.galleries = galleriesToSelect;

            return {
                galleries: widget.galleries ? widget.galleries : widget.content.galleries,
            };
        }

        function parseToSave(widget) {
            // var galleriesToSelect = [];
            //     angular.forEach(widget.content.galleries, function (gallery) {
            //       galleriesToSelect.push(gallery.id);
            //     });
            //     _obj.galleries = galleriesToSelect;

            return {
                galleries: widget.galleries ? widget.galleries : widget.content.galleries,
            };
        }
    }
})();
