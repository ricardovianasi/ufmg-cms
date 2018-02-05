(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ComHighlightNewsService', ComHighlightNewsService);

    /** ngInject */
    function ComHighlightNewsService(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(scope) {
            scope.news = [];
            scope.widget.content = scope.widget.content || {};
            scope.widget.content.news = scope.widget.content.news || [];
            CommonWidgetService.preparingNews(scope);
        }

        function parseToLoad(widget) {
            return {
                content: widget.content,
                news: [{
                    selected: widget.content.news[0]
                }, {
                    selected: widget.content.news[1]
                }]
            };
        }

        function parseToSave(widget) {
            let objToSave = { type: widget.type, news: [] };
            if(widget.content && widget.content.news) {
                objToSave.news = widget.content.news.map(function (news) { return news.id; }); 
            }
            return objToSave;
        }
    }
})();
