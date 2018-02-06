(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('SidebarButtonService', SidebarButtonService);

    /** ngInject */
    function SidebarButtonService(CommonWidgetService, MediaService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            ctrl.icons = [];

            MediaService.getIcons().then(function (data) {
                ctrl.icons = data.data;
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
                label: widget.label || (widget.content ? widget.content.label : null),
                url: widget.url || (widget.content ? widget.content.external_url : null),
                icon: widget.icon || (widget.content ? widget.content.icon.id : null),
            };
        }
    }
})();
