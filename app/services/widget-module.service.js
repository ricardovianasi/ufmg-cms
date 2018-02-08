(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('WidgetModuleService', WidgetModuleService);

    /** ngInject */
    function WidgetModuleService(ComHighlightNewsService, ComEventsService, EditorialNewsService, HighlightedEventService,
        HighlightedEventsService, HighlightedNewsService, HighlightedNewsVideo, HighlightedRadioNews, ComHubService,
        HighlightedReleaseService, MainHighLightService, ComService, SidebarButtonService) {
        var service = {
            getWidget: getWidget
        };

        var widgets;
        
        return service;
        
        ////////////////

        function getWidget(type) {
            if(!widgets) {
                _loadWidgets();
            }
            return widgets[type];
        }

        function _loadWidgets() {
            widgets = {
                comevents: ComEventsService,
                comhighlightnews: ComHighlightNewsService,
                editorialnews: EditorialNewsService,
                highlightedevent: HighlightedEventService,
                highlightedevents: HighlightedEventsService,
                highlightednews: HighlightedNewsService,
                highlightednewsvideo: HighlightedNewsVideo,
                highlightedradionews: HighlightedRadioNews,
                highlightedrelease: HighlightedReleaseService,
                mainhighlight: MainHighLightService,
                comhub: ComHubService,
                comservice: ComService,
                sidebarbutton: SidebarButtonService
            };
        }

    }
})();