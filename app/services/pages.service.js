(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('PagesService', PagesService);

    /** ngInject */
    function PagesService($timeout, $log, $http, $filter, $uibModal, $q, $rootScope, apiUrl, GalleryService,
        ReleasesService, Util, HighlightedNewsService, ComEventsService, ReleaseListService, TagCloudService,
        EditorialNewsService, HighlightedEventService, HighlightedEventsService, ComHighlightNewsService, FaqWidgetService,
        HighlightedNewsVideo, HighlightedRadioNews, HighlightedReleaseService, SidebarButtonService, RelatedNewsService,
        EventListService, LastImagesSideBarService, LastTvProgramsService, ListNewsService, SearchService, GalleryWidgetService) {

            $log.info('PagesService');

        function request(event, fnResquest, order_by, searchQuery, customFilter) {
            var dataReturn = [];
            var hasRequest = false;
            var countPage = 1;
            var search = false;
            var currentElement = 0;

            $rootScope.$on('set' + event, function (event, data) {
                countPage = data.countPage;
                hasRequest = data.hasRequest;
                dataReturn = data.data;
                currentElement = data.currentElement;
                search = data.search;
                _getDatarequest();
            });

            function _getDatarequest() {
                let params = {
                    page: countPage,
                    page_size: 30,
                    order_by: order_by,
                    search: search,
                    filter: customFilter
                };
                if (!params.search && countPage === 1) {
                    currentElement = 0;
                }
                $log.info('_getDatarequest', event);
                fnResquest(Util.getParams(params, searchQuery))
                    .then(function (res) {
                        countPage++;
                        dataReturn = res.data.items;
                        currentElement += dataReturn.length;
                        if (res.data.total > currentElement && res.data.items.length <= params.page_size) {
                            hasRequest = false;
                        }
                        $timeout(function () {
                            $rootScope.$emit('get' + event, {
                                hasRequest: hasRequest,
                                countPage: countPage,
                                data: dataReturn,
                                currentElement: currentElement
                            });
                        }, 100);
                    });
            }
        }

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
                    return {
                        text: widget.text || (widget.content ? widget.content.text : null),
                    };
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
                    return {
                        gallery: widget.gallery_id || (widget.content ? widget.content.gallery.id : null),
                    };
                },

                highlightedgalleries: function (widget) {
                    // var galleriesToSelect = [];
                    //     angular.forEach(widget.content.galleries, function (gallery) {
                    //       galleriesToSelect.push(gallery.id);
                    //     });
                    //     _obj.galleries = galleriesToSelect;

                    return {
                        galleries: widget.galleries ? widget.galleries : widget.content.galleries,
                    };
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

                    var widgetLinks = [];
                    var page;
                    var external_url;
                    var linksOnEach = widget.links ? widget.links : widget.content.links;

                    angular.forEach(linksOnEach, function (links) {
                        if (links.external_url) {
                            links.isExternal = true;
                        }

                        if (!links.isExternal) {
                            external_url = null;
                            page = links.page ? links.page.id : null;
                        } else {
                            external_url = links.external_url ? links.external_url : null;
                            page = null;
                        }

                        widgetLinks.push({
                            page: page,
                            label: links.label,
                            external_url: external_url,
                        });
                    });

                    return {
                        links: widgetLinks,
                    };
                },

                hublinks: function (widget) {
                    if (widget.content) {
                        angular.forEach(widget.content.links, function (v, k) {
                            if (typeof widget.content.links[k].page === 'object' &&
                                typeof widget.content.links[k].page !== 'number' &&
                                widget.content.links[k].page !== null) {
                                widget.content.links[k].page = widget.content.links[k].page.id ?
                                    widget.content.links[k].page.id :
                                    widget.content.links[k].page;
                            }
                        });
                    } else {
                        angular.forEach(widget.links, function (v, k) {
                            if (typeof widget.links[k].page === 'object' &&
                                typeof widget.links[k].page !== 'number' &&
                                widget.links[k].page !== 'null' &&
                                widget.links[k].external_url === null) {
                                widget.links[k].page = widget.links[k].page.id ?
                                    widget.links[k].page.id :
                                    widget.links[k].page;
                            }
                        });
                    }

                    return {
                        links: widget.content ? widget.content.links : widget.links,
                    };
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
                    return {
                        text: widget.text || (widget.content ? widget.content.text : null),
                    };
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
                    return {
                        gallery_id: widget.gallery_id || (widget.content ? widget.content.gallery.id : null),
                    };
                },

                highlightedgalleries: function (widget) {
                    // var galleriesToSelect = [];
                    //     angular.forEach(widget.content.galleries, function (gallery) {
                    //       galleriesToSelect.push(gallery.id);
                    //     });
                    //     _obj.galleries = galleriesToSelect;

                    return {
                        galleries: widget.galleries ? widget.galleries : widget.content.galleries,
                    };
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
                    var widgetLinks = [];

                    if (!widget.content) {
                        widget.content = {
                            links: widget.links
                        };
                    }

                    angular.forEach(widget.content.links, function (links) {
                        if (links.external_url) {
                            links.isExternal = true;
                            widgetLinks.push(links);
                        } else {
                            widgetLinks.push(links);
                        }
                    });

                    return {
                        links: widgetLinks,
                    };
                },

                hublinks: function (widget) {
                    angular.forEach(widget.content.links, function (v, k) {
                        if (widget.content.links[k].external_url) {
                            widget.content.links[k].link_type = 'link';
                        } else {
                            widget.content.links[k].link_type = 'page';
                            widget.content.links[k].page = widget.content.links[k].page ?
                                widget.content.links[k].page :
                                false;
                        }
                    });

                    return {
                        links: widget.content ? widget.content.links : null,
                    };
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

            var _preparingGalleries = function ($scope) {
                $scope.galleries = [];

                GalleryService.getGalleries().then(function (data) {
                    $scope.galleries = data.data;
                });
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

                internalmenu: function ($scope) {
                    $log.info('internalmenu');
                    request('LoadMorePage', _getPages, {
                        field: 'title',
                        direction: 'ASC'
                    }, 'title');

                    $scope.pages = [];
                    $scope.widget.links = $scope.widget.links || [];

                    $scope.addItem = function () {
                        $scope.widget.links.push({
                            title: '',
                            url: '',
                        });
                    };

                    $scope.removeItem = function (idx) {
                        if ($scope.widget.links[idx]) {
                            $scope.widget.links.splice(idx, 1);
                        }
                    };
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
                highlightedgalleries: _preparingGalleries,
                highlightedgallery: _preparingGalleries,
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
                hublinks: function ($scope) {
                    $log.info('hublinks');
                    request('LoadMorePage', _getPages, {
                        field: 'title',
                        direction: 'ASC'
                    }, 'title');

                    $scope.widget.links = $scope.widget.links || [];

                    $scope.addItem = function () {
                        $scope.widget.links.push({
                            title: '',
                            url: '',
                        });
                    };

                    $scope.removeItem = function (idx) {
                        if ($scope.widget.links[idx]) {
                            $scope.widget.links.splice(idx, 1);
                        }
                    };

                    $scope.changeType = function (idx) {
                        if ($scope.widget.links[idx].link_type === 'page') {
                            $scope.widget.links[idx].external_url = null;
                        } else {
                            $scope.widget.links[idx].page = null;
                        }
                    };

                    $scope.sortableOptions = {
                        accept: function (sourceItemHandleScope, destSortableScope) {
                            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                        },
                        containment: '#sort-main'
                    };
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
                    var obj = {};
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
