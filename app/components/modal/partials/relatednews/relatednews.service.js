(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('RelatedNewsService', RelatedNewsService);

    /** ngInject */
    function RelatedNewsService(CommonWidgetService, TagsService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            CommonWidgetService.preparingNewsTypes(ctrl);
        }

        function parseToLoad(widget) {
            let objLoaded = {
                limit: widget.limit || (widget.content ? widget.content.limit : null),
                typeNews: _getTypeNews(widget) || '',
                tags: _getTags(widget)
            }
            return objLoaded;
        }

        function parseToSave(widget) {
            if (widget.content && widget.content.tags.length > 0 && typeof widget.content.tags[0].text !== 'undefined') {
                widget.content.tags = _.map(widget.content.tags, 'text');
            } else if (widget.tags && widget.tags.length > 0 && typeof widget.tags[0].text !== 'undefined') {
                widget.tags = _.map(widget.tags, 'text');
            }

            return {
                limit: widget.limit || (widget.content ? widget.content.limit : null),
                typeNews: widget.typeNews || (widget.content ? widget.content.typeNews : null),
                tags: widget.tags || (widget.content ? widget.content.tags : null),
            };
        }

        function _getTypeNews(widget) {
            if (widget.content && widget.content.typeNews !== null) {
                return widget.content.typeNews.id;
            }
            return widget.typeNews;
        }

        function _getTags(widget) {
            if (widget.content) {
                return TagsService.convertTagsInput(widget.content.tags);
            } else {
                return widget.tags;
            }
        }
    }
})();
