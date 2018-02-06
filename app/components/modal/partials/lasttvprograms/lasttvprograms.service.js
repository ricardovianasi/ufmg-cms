(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('LastTvProgramsService', LastTvProgramsService);

    /** ngInject */
    function LastTvProgramsService(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            CommonWidgetService.preparingNews(ctrl);
            CommonWidgetService.prepareItems(ctrl);
        }

        function parseToLoad(widget) {
            return {
                type: widget.type,
            };
        }

        function parseToSave(widget) {
            return {
                type: widget.type,
                title: widget.title,
            };
        }
    }
})();
