(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('LastImagesSideBarService', LastImagesSideBarService);

    /** ngInject */
    function LastImagesSideBarService(GalleryService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            ctrl.categories = [];

            GalleryService.getCategories().then(function (data) {
                ctrl.categories = data.data;
            });
        }

        function parseToLoad(widget) {
            return _parseWidget(widget);
        }

        function parseToSave(widget) {
            return _parseWidget(widget);
        }

        function _parseWidget(widget) {
            return {
                category: widget.category || (widget.content ? widget.content.category.id : null),
            };
        }
    }
})();
