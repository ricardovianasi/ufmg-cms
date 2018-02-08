(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('WidgetModuleService', WidgetModuleService);

    /** ngInject */
    function WidgetModuleService($uibModal, ComHighlightNewsService, ComEventsService, EditorialNewsService, 
        HighlightedEventService, HighlightedEventsService, HighlightedNewsService, HighlightedNewsVideo, 
        HighlightedRadioNews, ComHubService, HighlightedReleaseService, MainHighLightService, ComService, 
        SidebarButtonService, ComLastEditionService, EventListService, LastImagesSideBarService, LastTvProgramsService,
        ListNewsService, RelatedEventsService, RelatedNewsService, ReleaseListService, ComRadioVideoService,
        ContactCardService, RectorService, ContactFormService, EventCalendarService, FaqWidgetService,
        InstagramLastImageService, SearchService, TagCloudService, GalleryWidgetService, TextService, GridGalleryService,
        HighlightedGalleriesService, HighlightedGalleryService, HublinksService, InternalMenuService) {

        var service = {
            getWidget: getWidget,
            openWidgetModal: openWidgetModal
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

        function openWidgetModal(listWidgets, currentWidget) {
            let widgetModal = $uibModal.open({
                templateUrl: 'components/modal/module.modal.template.html',
                controller: 'ModuleModalController',
                controllerAs: 'ctrlModal',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    module: function () { return currentWidget; },
                    widgets: function () { return listWidgets; }
                }
            });
            return widgetModal.result;
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
                sidebarbutton: SidebarButtonService,
                comlastedition: ComLastEditionService,
                eventlist: EventListService,
                lastimagessidebar: LastImagesSideBarService,
                lasttvprograms: LastTvProgramsService,
                listnews: ListNewsService,
                relatedevents: RelatedEventsService,
                relatednews: RelatedNewsService,
                releaselist: ReleaseListService,
                comradiovideo: ComRadioVideoService,
                contactcard: ContactCardService,
                rector: RectorService,
                contactform: ContactFormService,
                eventcalendar: EventCalendarService,
                faq: FaqWidgetService,
                instagramlastimage: InstagramLastImageService,
                search: SearchService,
                tagcloud: TagCloudService,
                gallery: GalleryWidgetService,
                text: TextService,
                gridgallery: GridGalleryService,
                highlightedgalleries: HighlightedGalleriesService,
                highlightedgallery: HighlightedGalleryService,
                hublinks: HublinksService,
                internalmenu: InternalMenuService
            };
        }

    }
})();