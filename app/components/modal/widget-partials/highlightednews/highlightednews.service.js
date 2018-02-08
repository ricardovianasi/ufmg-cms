(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('HighlightedNewsService', HighlightedNewsService);

    /** ngInject */
    function HighlightedNewsService(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(scope) {
            CommonWidgetService.preparingNews(scope);
            CommonWidgetService.prepareItems(scope);
        }

        function parseToLoad(widget) {
            let resultWidget = {};
            var tagHighlightednews = widget.tag || [];
            resultWidget.tag = [];                    
            if (widget.news) {
                resultWidget.news = widget.news;
            } else if(widget.content) {
                if (widget.content.tag) {
                    tagHighlightednews = widget.content.tag;
                }
                if (widget.content.news) {
                    var newsToSelect = [];

                    angular.forEach(widget.content.news, function (news) {
                        newsToSelect.push({
                            id: news.id,
                            title: news.title
                        });
                    });
                    resultWidget.news = newsToSelect;
                }
            }
            if(tagHighlightednews && (tagHighlightednews[0] || tagHighlightednews.name)) {
                resultWidget.tag = [tagHighlightednews[0] ? tagHighlightednews[0] : tagHighlightednews.name];
            }
            return resultWidget;
        }

        function parseToSave(widget) {
            var newsToSelect = [];
            let resultWidget = {};
            if(widget.tag && widget.tag.length > 0) {
                if (typeof widget.tag[0].text !== 'undefined') {
                    widget.tag = _.map(widget.tag, 'text');
                }
            } else if(widget.content && widget.content.tag) {
                widget.tag = [widget.content.tag.name];
            }
            resultWidget.tag = widget.tag || [];

            if (widget.news) {
                angular.forEach(widget.news, function (news) {
                    newsToSelect.push(news.id);
                });
                resultWidget.news = newsToSelect;
            } else if (widget.content && widget.content.news) {
                newsToSelect = [];

                angular.forEach(widget.content.news, function (news) {
                    newsToSelect.push(news.id);
                });
                resultWidget.news = newsToSelect;
            }
            return resultWidget;
        }
    }
})();