(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('PagesService', PagesService);

    /** ngInject */
    function PagesService($timeout, $log, $http, $filter, $uibModal, $q, $rootScope, apiUrl, GalleryService, InternalMenuService,
        ReleasesService, Util, HighlightedNewsService, ComEventsService, ReleaseListService, TagCloudService, TextService,
        EditorialNewsService, HighlightedEventService, HighlightedEventsService, ComHighlightNewsService, FaqWidgetService,
        HighlightedNewsVideo, HighlightedRadioNews, HighlightedReleaseService, SidebarButtonService, RelatedNewsService,
        EventListService, LastImagesSideBarService, LastTvProgramsService, ListNewsService, SearchService, GalleryWidgetService,
        HublinksService, HighlightedGalleriesService, HighlightedGalleryService) {

        var _parseData = function (page) {
            $log.info('parseData', page);
            var cleanPage = {};

            cleanPage.image = page.image ? page.image.id : null;
            cleanPage.status = page.status;


            cleanPage.post_date = postDateToSave(page.scheduled_date, page.scheduled_time);

            cleanPage.tags = _.map(page.tags, 'text');
            cleanPage.title = page.title;

            //@todo: change this to editable slug
            // cleanPage.slug = page.title;
            cleanPage.widgets = {
                main: [],
                side: []
            };

            // Insert each widget into main and side columns
            angular.forEach(page.widgets.main, function (widget) {
                let widgetMake = _module.makeWidget(widget);
                cleanPage.widgets.main.push(widgetMake);
            });

            angular.forEach(page.widgets.side, function (widget) {
                cleanPage.widgets.side.push(_module.makeWidget(widget));
            });

            // If we are updating the Page
            if (page.id) {
                cleanPage.id = page.id;

                delete cleanPage.created_at;
                delete cleanPage.udpated_at;
                delete cleanPage.scheduled_at;
            }

            if (page.columns === 1) {
                cleanPage.widgets.side = [];
            }
            if (page.parent) {
                cleanPage.parent = page.parent.id ? page.parent.id : page.parent;
            } else {
                cleanPage.parent = null;
            }
            cleanPage.page_type = page.page_type;
            cleanPage.slug = angular.isDefined(page.slug) ? page.slug.slug : '';

            return cleanPage;
        };

        function postDateToSave(scheduled_date, scheduled_time) {
            if (!scheduled_date) {
                return undefined;
            }
            var datePost = new Date(scheduled_date);
            var dd = datePost.getDate();
            var mm = datePost.getMonth() + 1;

            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }

            var yyyy = datePost.getFullYear();

            if (!scheduled_time) {
                var date = new Date();
                var hh = date.getHours();
                var MM = date.getMinutes();
                if (hh < 10) {
                    hh = '0' + hh;
                }
                if (MM < 10) {
                    MM = '0' + MM;
                }
                scheduled_time = hh + ':' + MM;
            }

            return dd + '/' + mm + '/' + yyyy + ' ' + scheduled_time;
        }

        var _getPages = function (params, ignoreLoadingBar) {
            if (angular.isUndefined(params)) {
                params = '';
            }
            return $http.get(apiUrl + '/page' + params, {
                ignoreLoadingBar: ignoreLoadingBar
            });
        };

        var _module = (function (_getPages, $uibModal) { // jshint ignore: line
            // Parse widget object to send its data to webservice
            var _parseToSave = {

                text: function (widget) {
                    return TextService.parseToSave(widget);
                },

                highlightedevent: function (widget) {
                    return HighlightedEventService.parseToSave(widget);
                },

                highlightedevents: function (widget) {
                    return HighlightedEventsService.parseToSave(widget);
                },

                gallery: function (widget) {
                    return GalleryWidgetService.parseToSave(widget);
                },

                highlightedgallery: function (widget) {
                    return HighlightedGalleryService.parseToSave(widget);
                },

                highlightedgalleries: function (widget) {
                    return HighlightedGalleriesService.parseToSave(widget);
                },

                lastimagessidebar: function (widget) {
                    return LastImagesSideBarService.parseToSave(widget);
                },

                listnews: function (widget) {
                    return ListNewsService.parseToSave(widget);
                },

                eventlist: function (widget) {
                    return EventListService.parseToSave(widget);
                },

                releaselist: function (widget) {
                    return ReleaseListService.parseToSave(widget);
                },

                relatednews: function (widget) {
                    return RelatedNewsService.parseToSave(widget);
                },

                highlightednews: function (widget) {
                    return HighlightedNewsService.parseToSave(widget);
                },

                highlightedradionews: function (widget) {
                    return HighlightedRadioNews.parseToSave(widget);
                },

                highlightednewsvideo: function (widget) {
                    return HighlightedNewsVideo.parseToSave(widget);
                },

                /* jshint ignore:start */
                editorialnews: function (widget) {
                    return EditorialNewsService.parseToSave(widget);
                },
                /* jshint ignore:end */

                internalmenu: function (widget) {
                    return InternalMenuService.parseToSave(widget);
                },

                hublinks: function (widget) {
                    return HublinksService.parseToSave(widget);
                },

                sidebarbutton: function (widget) {
                    return SidebarButtonService.parseToSave(widget);
                },

                highlightedrelease: function (widget) {
                    return HighlightedReleaseService.parseToSave(widget);
                },

                lasttvprograms: function (widget) {
                    return LastTvProgramsService.parseToSave(widget);
                },

                comevents: function (widget) {
                    return ComEventsService.parseToSave(widget);
                },

                comhighlightnews: function (widget) {
                    return ComHighlightNewsService.parseToSave(widget);
                },

                faq: function (widget) {
                    return FaqWidgetService.parseToSave(widget);
                },

                tagcloud: function (widget) {
                    return TagCloudService.parseToSave(widget);
                },

                search: function (widget) {
                    return SearchService.parseToSave(widget);
                }
            };

            // Parse widget object from webservice data
            var _parseToLoad = {

                text: function (widget) {
                    return TextService.parseToLoad(widget);
                },

                highlightedevent: function (widget) {
                    return HighlightedEventService.parseToLoad(widget);
                },

                highlightedevents: function (widget) {
                    return HighlightedEventsService.parseToLoad(widget);
                },

                highlightednewsvideo: function (widget) {
                    return HighlightedNewsVideo.parseToLoad(widget);
                },

                highlightedradionews: function(widget) {
                    return HighlightedRadioNews.parseToLoad(widget);
                },

                gallery: function (widget) {
                    return GalleryWidgetService.parseToLoad(widget);
                },

                highlightedgallery: function (widget) {
                    return HighlightedGalleryService.parseToLoad(widget);
                },

                highlightedgalleries: function (widget) {
                    return HighlightedGalleriesService.parseToLoad(widget);
                },

                lastimagessidebar: function (widget) {
                    return LastImagesSideBarService.parseToLoad(widget);
                },

                listnews: function (widget) {
                    return ListNewsService.parseToLoad(widget);
                },

                eventlist: function (widget) {
                    return EventListService.parseToLoad(widget);
                },

                releaselist: function (widget) {
                    return ReleaseListService.parseToLoad(widget);
                },

                relatednews: function (widget) {
                    return RelatedNewsService.parseToLoad(widget);
                },

                highlightednews: function (widget) {
                    return HighlightedNewsService.parseToLoad(widget);
                },
                editorialnews: function (widget) {
                    return EditorialNewsService.parseToLoad(widget);
                },

                internalmenu: function (widget) {
                    return InternalMenuService.parseToLoad(widget);
                },

                hublinks: function (widget) {
                    return HublinksService.parseToLoad(widget);
                },

                sidebarbutton: function (widget) {
                    return SidebarButtonService.parseToLoad(widget);
                },

                highlightedrelease: function (widget) {
                    return HighlightedReleaseService.parseToLoad(widget);
                },

                lasttvprograms: function (widget) {
                    return LastTvProgramsService.parseToLoad(widget);
                },

                comevents: function (widget) {
                    return ComEventsService.parseToLoad(widget);
                },

                comhighlightnews: function (widget) {
                    return ComHighlightNewsService.parseToLoad(widget);
                },

                faq: function (widget) {
                    return FaqWidgetService.parseToLoad(widget);
                },

                tagcloud: function (widget) {
                    return TagCloudService.parseToLoad(widget);
                },

                search: function (widget) {
                    return SearchService.parseToLoad(widget);
                }

            };

            // Partial preparing
            var _preparing = {
                highlightedrelease: function (ctrl, $scope) {
                    HighlightedReleaseService.load(ctrl, $scope);
                },

                sidebarbutton: function (ctrl) {
                    SidebarButtonService.load(ctrl);
                },

                relatednews: function (ctrl) {
                    RelatedNewsService.load(ctrl);
                },

                listnews: function (ctrl) {
                    ListNewsService.load(ctrl);
                },

                lastimagessidebar: function (ctrl) {
                    LastImagesSideBarService.load(ctrl);
                },

                internalmenu: function (ctrl) {
                    InternalMenuService.load(ctrl, _getPages);
                },

                highlightedradionews: function (ctrl) {
                    HighlightedRadioNews.load(ctrl);
                },

                highlightednewsvideo: function (ctrl) {
                    HighlightedNewsVideo.load(ctrl);
                },
                lasttvprograms: function (ctrl) {
                    LastTvProgramsService.load(ctrl);
                },
                highlightednews: function (ctrl) {
                    HighlightedNewsService.load(ctrl);
                },
                highlightedgalleries: function(ctrl) {
                    HighlightedGalleriesService.load(ctrl);
                },
                highlightedgallery: function(ctrl) {
                    HighlightedGalleryService.load(ctrl);
                },
                highlightedevents: function(ctrl) {
                    HighlightedEventsService.load(ctrl);
                },
                highlightedevent: function(ctrl) {
                    HighlightedEventService.load(ctrl);
                },
                gallery: function(ctrl) {
                    GalleryWidgetService.load(ctrl);
                },
                eventlist: function(ctrl) {
                    EventListService.load(ctrl);
                },
                editorialnews: function (ctrl) {
                    EditorialNewsService.load(ctrl);
                },

                comevents: function (ctrl) {
                    ComEventsService.load(ctrl);
                },
                comhighlightnews: function (ctrl) {
                    ComHighlightNewsService.load(ctrl);
                },
                hublinks: function (ctrl) {
                    HublinksService.load(ctrl, _getPages);
                },
                faq: function () {
                    FaqWidgetService.load();
                },

                search: function (ctrl) {
                    SearchService.load(ctrl);
                }
            };

            return {

                parseWidgetToSave: function (widget) {
                    if (typeof _parseToSave[widget.type] !== 'undefined') {
                        return _parseToSave[widget.type](widget);
                    }
                },
                parseWidgetToLoad: function (widget) {
                    let obj = {};
                    if (typeof _parseToLoad[widget.type] !== 'undefined') {
                        obj = _parseToLoad[widget.type](widget);
                    }
                    return obj;
                },
                preparePartial: function ($scope) {
                    let currentWidget = $scope.$parent.ctrlModal.widget;
                    if (_preparing[currentWidget.type]) {
                        _preparing[currentWidget.type]($scope.$parent.ctrlModal, $scope.$parent);
                    }
                },
                handle: function ($scope, column, idx) {
                    var moduleModal = $uibModal.open({
                        templateUrl: 'components/modal/module.modal.template.html',
                        controller: 'ModuleModalController',
                        controllerAs: 'ctrlModal',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            module: function () {
                                if (typeof idx !== 'undefined') {
                                    if ($scope.page) {
                                        return $scope.page.widgets[column][idx];
                                    } else {
                                        return $scope.course.widgets[column][idx];
                                    }
                                }
                                return false;
                            },
                            widgets: function () {
                                return $scope.widgets;
                            },
                        }
                    });

                    moduleModal.result.then(function (data) {
                        $log.warn('Widget pos modal', data);
                        if (typeof idx !== 'undefined') {
                            if ($scope.page) {
                                $scope.page.widgets[column][idx] = data;
                            } else {
                                $scope.course.widgets[column][idx] = data;
                            }
                        } else {
                            if ($scope.page) {
                                $scope.page.widgets[column].push(data);
                            } else {
                                $scope.course.widgets[column].push(data);
                            }
                        }
                    });
                },
                makeWidget: function (widget) {
                    var obj = {};

                    if (widget) {
                        if (widget.id) {
                            obj.id = widget.id;
                        }

                        obj.type = widget.type;
                        obj.title = widget.title;
                        angular.extend(obj, this.parseWidgetToSave(widget));
                    }
                    return obj;
                }
            };
        })(_getPages, $uibModal);

        return {
            // Columns defaults
            COLUMNS: [{
                value: 1,
                label: '1 coluna'
            }, {
                value: 2,
                label: '2 colunas'
            }],
            getPages: _getPages,
            addPage: function (page) {
                page = _parseData(page);
                return $http.post(apiUrl + '/page', page, { ignoreLoadingBar: true });
            },
            getPage: function (id) {
                return $http.get(apiUrl + '/page/' + id);
            },
            updatePage: function (id, page) {
                page = _parseData(page);
                return $http.put(apiUrl + '/page/' + id, page, { ignoreLoadingBar: true });
            },
            removePage: function (id) {
                return $http.delete(apiUrl + '/page/' + id);
            },
            getType: function () {
                return $http.get(apiUrl + '/page/type');
            },
            module: function () {
                return _module;
            }
        };
    }
})();
