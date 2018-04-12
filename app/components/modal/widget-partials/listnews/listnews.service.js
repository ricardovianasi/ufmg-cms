(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ListNewsService', ListNewsService);

    /** ngInject */
    function ListNewsService(CommonWidgetService) {
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
                typeNews: widget.typeNews || widget.typeNews === '' ? widget.typeNews : '',
                category: widget.category || (widget.content ? widget.content.category : null),
                limit: widget.limit || (widget.content ? widget.content.limit : null),
                highlight_ufmg: _getHighlightUfmg(widget),
                show_category_filter: _getShowCategoryFilter(widget),
                tags: _parseTags(widget)
            };
            if (widget.content && widget.content.typeNews !== null) {
                objLoaded.typeNews = widget.content.typeNews.id;
            }
            return objLoaded;
        }

        function parseToSave(widget) {
            let tags = [];
            let highlightUfmg = false;
            let showCategoryFilter = false;

            if (widget.content) {
                if ('tags' in widget.content && widget.content.tags.length > 0) {
                    if (typeof widget.content.tags[0].text !== 'undefined') {
                        widget.content.tags = _.map(widget.content.tags, 'text');
                    }
                    tags = widget.content.tags;
                } else {
                    tags = widget.tags || (widget.content ? widget.content.tags.id : null);
                }
                highlightUfmg = widget.content.highlight_ufmg;
                showCategoryFilter = widget.content.show_category_filter;
            } else {
                if ('tags' in widget && widget.tags.length > 0) {
                    if (typeof widget.tags[0].text !== 'undefined') {
                        widget.tags = _.map(widget.tags, 'text');
                    }
                    tags = widget.tags;
                } else {
                    tags = widget.tags || (widget.content ? widget.content.tags.id : null);
                }
                highlightUfmg = widget.highlight_ufmg;
                showCategoryFilter = widget.show_category_filter;
            }

            let res = {
                category: widget.category || (widget.content ? widget.content.category : null),
                limit: widget.limit || (widget.content ? widget.content.limit : null),
                typeNews: widget.typeNews || (widget.content ?
                    (widget.content.typeNews ? widget.content.typeNews.id : '') :
                    null),
                highlight_ufmg: highlightUfmg,
                show_category_filter: showCategoryFilter,
                tags: tags,
            };

            return res;
        }

        function _getHighlightUfmg(widget) {
            if(widget.highlight_ufmg) {
                return widget.highlight_ufmg;
            } else if(widget.content){
                return widget.content.highlight_ufmg;
            }
            return false;
        }

        function _getShowCategoryFilter(widget) {
            if(widget.show_category_filter) {
                return widget.show_category_filter;
            } else if(widget.content){
                return widget.content.show_category_filter;
            }
            return false;
        }

        function _parseTags(widget) {
            let tagsForTagsInput = [];
            if (widget.tags) {
                tagsForTagsInput = widget.tags.map(function (tag) {
                    return { text: tag.text };
                });
            } else if (widget.content && widget.content.tags) {
                tagsForTagsInput = widget.content.tags.map(function (tag) {
                    return { text: tag.name };
                });
            }
            return tagsForTagsInput;
        }
    }
})();
