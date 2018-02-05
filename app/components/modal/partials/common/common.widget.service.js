(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('CommonWidgetService', CommonWidgetService);

    /** ngInject */
    function CommonWidgetService($rootScope, $timeout, Util, NewsService, TagsService, EventsService) {
        var service = {
            request: request,
            preparingNews: preparingNews,
            prepareItems: prepareItems,
            preparingEvents: preparingEvents
        };
        
        return service;

        ////////////////

        function preparingEvents(scope) {
            prepareItems(scope);
            request('LoadMoreEvents', EventsService.getEvents, {
                field: 'initDate',
                direction: 'DESC'
            }, 'name');
        }

        function preparingNews(scope) {
            request('LoadMoreNews', NewsService.getNews, {
                field: 'postDate',
                direction: 'DESC'
            }, 'title');
            _getTags(scope);
        }

        function prepareItems (scope) {
            scope.addItem = function (item, type, prop) {
                console.log(item);
                if (scope.widget[type]) {
                    scope.widget[type].push(item);
                } else {
                    scope.widget[type] = [];
                    scope.widget[type].push(item);
                }
                if(prop) {
                    scope.widget[prop]  = null;
                }
            };

            scope.removeItem = function (idx, type) {
                if (scope.widget[type][idx]) {
                    scope.widget[type].splice(idx, 1);
                }
            };
        }

        function _getTags(scope) {
            request('LoadMoreTag', TagsService.getTags, {
                field: 'name',
                direction: 'ASC'
            }, 'name');
    
            scope.tags = [];

            TagsService.getTags().then(function (data) {
                scope.tags = data.data.items[0];
            });

            scope.findTags = function ($query) {
                return TagsService.findTags($query, scope.tags);
            };
        }

        function request(eventName, fnResquest, order_by, searchQuery, customFilter) {
            $rootScope.$on('set' + eventName, function (event, data) {
                data.dataReturn = data.data || [];
                angular.extend(data, 
                    {order_by: order_by, searchQuery: searchQuery, customFilter: customFilter, fnResquest: fnResquest});
                if (!data.search && data.countPage === 1) {
                    data.currentElement = 0;
                }
                _getDataRequest(data, eventName);
            });
        }

        function _getDataRequest(data, eventName) {
            let params = _getParamsDataRequest(data);
            data.fnResquest(Util.getParams(params, data.searchQuery))
                .then(function (res) {
                    data.countPage++;
                    data.dataReturn = res.data.items;
                    data.currentElement += data.dataReturn.length;
                    if (res.data.total > data.currentElement && res.data.items.length <= params.page_size) {
                        data.hasRequest = false;
                    }
                    _emitGetEvent(data, eventName);
            });
        }

        function _getParamsDataRequest(data) {
            return {
                page: data.countPage,
                page_size: 30,
                order_by: data.order_by,
                search: data.search,
                filter: data.customFilter
            };
        }

        function _emitGetEvent(data, eventName) {
            $timeout(function () {
                $rootScope.$emit('get' + eventName, {
                    hasRequest: data.hasRequest,
                    countPage: data.countPage,
                    data: data.dataReturn,
                    currentElement: data.currentElement
                });
            }, 100);
        }
    }
})();