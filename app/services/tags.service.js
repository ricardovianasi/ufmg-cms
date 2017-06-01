(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('TagsService', TagsService);

    /** ngInjetc */
    function TagsService($http, $q, apiUrl, $filter, $log) {
        $log.info('TagsService');

        function _tagsForTagsInput(tags) {
            var tagsForTagsInput = [];

            angular.forEach(tags, function (v, k) {
                tagsForTagsInput.push({
                    text: tags[k].name
                });
            });

            return tagsForTagsInput;
        }

        return {
            getTags: function (params) {
                var deferred = $q.defer();
                if (angular.isUndefined(params)) {
                    $http.get(apiUrl + '/tag').then(function (data) {
                        deferred.resolve(data);
                    });
                } else {
                    $http.get(apiUrl + '/tag' + params).then(function (data) {
                        deferred.resolve(data);
                    });
                }
                return deferred.promise;
            },
            findTags: function ($query, tags) {
                var allTags = _tagsForTagsInput(tags);
                return $filter('filter')(allTags, $query);
            }
        };
    }
})();
