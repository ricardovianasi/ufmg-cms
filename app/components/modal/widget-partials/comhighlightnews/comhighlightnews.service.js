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
        function load(ctrl) {
            ctrl.news = [];
            ctrl.widget.content = ctrl.widget.content || {};
            ctrl.widget.content.news = ctrl.widget.content.news || [];
            CommonWidgetService.preparingNews();
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
