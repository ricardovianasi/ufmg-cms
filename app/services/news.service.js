(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('NewsService', NewsService);

    /** ngInject */
    function NewsService($http, $filter, apiUrl, $log) {
        $log.info('NewsService');

        var NEWS_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'news');

        return {
            getNews: function (id, page) {
                page = page || 1;

                var url = $filter('format')('{0}?page={1}', NEWS_ENDPOINT, page);

                if (id) {
                    url = $filter('format')('{0}/{1}', NEWS_ENDPOINT, id);

                    return $http.get(url);
                }

                return $http.get(url);
            },
            getNewsCategories: function () {
                return $http.get(apiUrl + '/news/category');
            },
            getNewsTypes: function () {
                return $http.get(apiUrl + '/news/type');
            },
            postNews: function (data) {
                return $http.post(apiUrl + '/news', data);
            },
            updateNews: function (id, data) {
                return $http.put(apiUrl + '/news/' + id, data);
            },
            removeNews: function (id) {
                return $http.delete(apiUrl + '/news/' + id);
            },
            getTvProgram: function () {
                return $http.get(apiUrl + '/news/tv-program');
            }
        };
    }
})();
