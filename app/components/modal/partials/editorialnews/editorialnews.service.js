(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('EditorialNewsService', EditorialNewsService);

    /** ngInject */
    function EditorialNewsService(CommonWidgetService) {
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
            var newsToSelect = [];
            var tagsForTagsInput = [];
            var tagText = false;

            if (widget.tag && widget.tag[0]) {
                tagText = widget.tag[0].text;
            } else if (widget.content && widget.content.tag) {
                tagText = widget.content.tag.name;
            }

            if (tagText) {
                tagsForTagsInput.push({
                    text: tagText
                });
            }

            if (widget.origin) {
                if (widget.origin === '1' && widget.news) {
                    return {
                        news: widget.news,
                        origin: widget.origin || (widget.content ? widget.content.origin : null),
                        tag: tagsForTagsInput
                    };
                } else if (widget.origin === '0') {
                    return {
                        news: null,
                        origin: widget.origin || (widget.content ? widget.content.origin : null),
                        tag: tagsForTagsInput
                    };
                }
            } else if (widget.content.origin !== null) {
                if (widget.content.origin === '1' && widget.content.news) {
                    angular.forEach(widget.content.news, function (news) {
                        newsToSelect.push({
                            id: news.id,
                            title: news.title
                        });
                    });

                    return {
                        news: newsToSelect,
                        origin: widget.origin || (widget.content ? widget.content.origin : null),
                        tag: tagsForTagsInput
                    };
                } else if (widget.content.origin === '0') {
                    return {
                        news: null,
                        origin: widget.origin || (widget.content ? widget.content.origin : null),
                        tag: tagsForTagsInput
                    };
                }
            }
        }

        function parseToSave(widget) {
            var newsToSelect = [];
            var tagText = false;
            var tagForSave = [];

            if (widget.tag && widget.tag[0]) {
                tagText = widget.tag[0].text;
            } else if (widget.content && widget.content.tag) {
                tagText = widget.content.tag.name;
            }

            if (tagText) {
                tagForSave = [tagText];
            }
            if (widget.origin) {
                if (widget.origin === '1' && widget.news) {
                    newsToSelect = [];

                    angular.forEach(widget.news, function (news) {
                        newsToSelect.push(news.id);
                    });

                    return {
                        news: newsToSelect,
                        origin: widget.origin || (widget.content ? widget.content.origin : null),
                        tag: tagForSave
                    };
                } else if (widget.origin === '0') {
                    return {
                        news: null,
                        origin: widget.origin || (widget.content ? widget.content.origin : null),
                        tag: tagForSave
                    };
                }
            } else if (widget.content.origin !== null) {
                if (widget.content.origin === '1' && widget.content.news) {
                    newsToSelect = [];

                    angular.forEach(widget.content.news, function (news) {
                        newsToSelect.push(news.id);
                    });

                    return {
                        news: newsToSelect,
                        origin: widget.origin || (widget.content ? widget.content.origin : null),
                        tag: tagForSave
                    };
                } else if (widget.content.origin === '0') {
                    return {
                        news: null,
                        origin: widget.origin || (widget.content ? widget.content.origin : null),
                        tag: tagForSave
                    };
                }
            }
        }
    }
})();