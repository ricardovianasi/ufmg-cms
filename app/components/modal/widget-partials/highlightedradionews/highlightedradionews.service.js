(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('HighlightedRadioNews', HighlightedRadioNews);

    /** ngInject */
    function HighlightedRadioNews(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(scope) {
            CommonWidgetService.preparingNews();
            CommonWidgetService.prepareItems(scope);
        }

        function parseToLoad(widget) {
            let objParse = {news: widget.news || []};
            if('content' in widget) {
                objParse.news = widget.content.news;
            }
            return objParse;
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
    }
})();
