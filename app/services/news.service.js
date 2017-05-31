(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('NewsService', NewsService);

    /** ngInject */
    function NewsService($http, $filter, $q, apiUrl, $log) {
        $log.info('NewsService');

        return {
            getNew: function (id) {
                return $http.get(apiUrl + '/news/' + id);
            },
            getNews: function (params, type) {
                if (angular.isUndefined(params)) {
                    params = '';
                }
                var paramType = getParamType(type);
                if (!paramType) {
                    return $q.reject(false);
                }
                return $http.get(apiUrl + '/news' + params + paramType);
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

        function getParamType(type) {
            if (!type) {
                return '';
            }
            if (type === 'agencia-de-noticias') {
                return '&query[filter][' + 98 + '][type]=innerjoin' +
                    '&query[filter][' + 98 + '][field]=type' +
                    '&query[filter][' + 98 + '][alias]=TNEWS' +
                    '&query[filter][' + 99 + '][type]=orx' +
                    '&query[filter][' + 99 + '][conditions][' + 0 + '][type]=eq' +
                    '&query[filter][' + 99 + '][conditions][' + 0 + '][field]=slug' +
                    '&query[filter][' + 99 + '][conditions][' + 0 + '][value]=' + type +
                    '&query[filter][' + 99 + '][conditions][' + 0 + '][alias]=TNEWS' +
                    '&query[filter][' + 99 + '][conditions][' + 0 + '][where]=or' +
                    '&query[filter][' + 99 + '][conditions][' + 1 + '][type]=eq' +
                    '&query[filter][' + 99 + '][conditions][' + 1 + '][field]=highlightUfmg' +
                    '&query[filter][' + 99 + '][conditions][' + 1 + '][value]=1' +
                    '&query[filter][' + 99 + '][where]=and';
            }
            return '&query[filter][' + 98 + '][type]=innerjoin' +
                '&query[filter][' + 98 + '][field]=type' +
                '&query[filter][' + 98 + '][alias]=TNEWS' +
                '&query[filter][' + 99 + '][type]=eq' +
                '&query[filter][' + 99 + '][field]=slug' +
                '&query[filter][' + 99 + '][value]=' + type +
                '&query[filter][' + 99 + '][alias]=TNEWS' +
                '&query[filter][' + 99 + '][where]=and';
        }
    }
})();
