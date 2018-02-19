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
            let obj = {};
            if(widget.galleries || widget.content) {
                obj.galleries = widget.galleries ? widget.galleries : widget.content.galleries;
            }
            return obj;
        }

        function parseToSave(widget) {
            // var galleriesToSelect = [];
            //     angular.forEach(widget.content.galleries, function (gallery) {
            //       galleriesToSelect.push(gallery.id);
            //     });
            //     _obj.galleries = galleriesToSelect;
            let obj = {};
            if(widget.galleries || widget.content) {
                obj.galleries = widget.galleries ? _parseGalleries(widget.galleries) : _parseGalleries(widget.content.galleries);
            }
            return obj;
        }

        function _parseGalleries(galleries) {
            return galleries.map(function(gallery) {
                return { id: gallery.id };
            });
        }
    }
})();
