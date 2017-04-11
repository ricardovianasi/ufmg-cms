(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('NewsService', NewsService);

    /** ngInject */
    function NewsService($http, $filter, apiUrl, $log) {
        $log.info('NewsService');

        var NEWS_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'news');

        return {
            getNew: function (id) {
                return $http.get(apiUrl + '/news/' + id);
            },
            getNews: function (params) {
                if (angular.isUndefined(params)) {
                    params = '';
                }
                return $http.get(apiUrl + '/news' + params);
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
