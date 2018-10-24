(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('TagsService', TagsService);

    /** ngInjetc */
    function TagsService($http, apiUrl, $filter, ServerService) {
        let KeyLoadedTag = 'listTags';
        let baseUrl = apiUrl + '/tag';

        let service = {
            getTags: getTags,
            findTags: findTags,
            convertTagsInput: convertTagsInput,
            addTagOnDataLoaded: addTagOnDataLoaded,
            postTag: postTag,
            updateTag: updateTag,
            deleteTag: deleteTag
        };

        return service;

        function deleteTag(id) {
            return $http.delete(_getUrlTagId(id));
        }

        function postTag(data) {
            return $http.post(baseUrl, data);
        }

        function updateTag(data) {
            return $http.put(_getUrlTagId(data.id), data);
        }

        function getTags(params) {
            let url = apiUrl + '/tag' + (params || '');
            if(params) {
                return ServerService.getLoaded('', url, { useLoaded: false });
            }
            return ServerService.getLoaded(KeyLoadedTag, url, { useLoaded: true });
        }

        function findTags(query, tags = []) {
            const tagsFilter = tags.map(tag => ({text: tag.name}))
                .filter(tag => tag.text.toLowerCase().includes(query))
                .sort((a, b) => {
                    if(a.text>b.text) return 1;
                    if(a.text<b.text) return -1;
                    return 0;
                });
            console.log('findTags',
                query,
                tagsFilter,
                tags);
            return tagsFilter;
        }

        function convertTagsInput(tags) {
            tags = tags ? tags : [];
            return tags.map(function(tag) {
                return { text: tag.name };
            });
        }

        function addTagOnDataLoaded(tag) {
            if (ServerService.hasData(KeyLoadedTag)) {
                let dataTags = ServerService.getData(KeyLoadedTag);
                let hasTag = tag.text;
                if(!hasTag) {
                    _includeNewTagOnData(tag, dataTags);
                    ServerService.setData(KeyLoadedTag, dataTags);
                }

            }
        }

        function _getUrlTagId(id) {
            return baseUrl + '/' + id;
        }

        function _includeNewTagOnData(tag, dataTags) {
            dataTags.data.items.push({name: tag.text});
        }
    }
})();
