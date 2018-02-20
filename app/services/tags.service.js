(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('TagsService', TagsService);

    /** ngInjetc */
    function TagsService($http, apiUrl, $filter, ServerService) {
        let KeyLoadedTag = 'listTags';

        let service = {
            getTags: getTags,
            findTags: findTags,
            convertTagsInput: convertTagsInput,
            addTagOnDataLoaded: addTagOnDataLoaded,
            getTagsWithParams: getTagsWithParams
        };

        return service;

        function getTagsWithParams(params) {
            let url = apiUrl + '/tag?' + _convertParams(params);
            return $http.get(url);
        }

        function getTags(params) {
            let url = apiUrl + '/tag' + (params || '');
            if(params) {
                return ServerService.getLoaded('', url, { useLoaded: false });
            }
            return ServerService.getLoaded(KeyLoadedTag, url, { useLoaded: true });
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

        function addTagOnDataLoaded(tag) {
            if (ServerService.hasData(KeyLoadedTag)) {
                let dataTags = ServerService.getData(KeyLoadedTag);
                let listTags = dataTags.data.items[0];
                let stringTags = dataTags.data.items[1].string;
                let hasTag = tag.text && stringTags.includes(tag.text);
                if(!hasTag) {
                    _includeNewTagOnData(tag, dataTags);
                    ServerService.setData(KeyLoadedTag, dataTags);
                }

            } 
        }

        function _includeNewTagOnData(tag, dataTags) {
            dataTags.data.items[0].push({name: tag.text});
            dataTags.data.items[1].string += ',' + tag.text;
        }

        function _convertParams(params) {
            let urlParams = '';
            for(let key in params) {
                if(params[key]) {
                    urlParams += key + '=' + params[key] + '&';
                }
            }
            console.log('_convertParams', params, urlParams);
            return urlParams;
        }
    }
})();
