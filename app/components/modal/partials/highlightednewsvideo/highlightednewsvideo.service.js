(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('HighlightedNewsVideo', HighlightedNewsVideo);

    /** ngInject */
    function HighlightedNewsVideo(CommonWidgetService, NewsService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(scope) {
            _preparingNewsVideo();
            CommonWidgetService.preparingNews(scope);
            CommonWidgetService.prepareItems(scope);
        }

        function parseToLoad(widget) {
            let obj = {
                text: widget.text,
            };

            if ('content' in widget) {
                obj.news = widget.content.news;
            } else {
                obj.news = widget.news;
            }

            return obj;
        }

        function parseToSave(widget) {
            if (widget.news) {
                var newsToSelect = [];

                angular.forEach(widget.news, function (news) {
                    newsToSelect.push(news.id);
                });

                return {
                    news: newsToSelect,
                };
            }

            return {
                news: widget.news,
            };
        }

        function _preparingNewsVideo() {
            CommonWidgetService.request('EventHighlightednewsvideo', NewsService.getNews, {
                field: 'postDate',
                direction: 'DESC'
            }, 'title', {
                field: 'hasVideo',
                value: 1
            });
        }
    }
})();
