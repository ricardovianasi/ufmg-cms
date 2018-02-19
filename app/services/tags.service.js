(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('TagsService', TagsService);

    /** ngInjetc */
    function TagsService($http, apiUrl, $filter, ServerService) {

        let service = {
            getTags: getTags,
            findTags: findTags,
            convertTagsInput: convertTagsInput
        };

        return service;

        function getTags(params) {
            let url = apiUrl + '/tag' + (params || '');
            if(params) {
                return ServerService.getLoaded('', url, { useLoaded: false });
            }
            return ServerService.getLoaded('listTags', url, { useLoaded: true });
            // return $http.get(url);
        }

        function findTags($query, tags) {
            var allTags = convertTagsInput(tags);
            return $filter('filter')(allTags, $query);
        }

        function convertTagsInput(tags) {
            tags = tags ? tags : [];
            return tags.map(function(tag) {
                return { text: tag.name };
            });
        }
    }
})();
