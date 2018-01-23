(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('NewsService', NewsService);

    /** ngInject */
    function NewsService($http, $filter, $q, apiUrl, $log) {
        $log.info('NewsService');


        function convertPostDateToSend(data) {
            var datePost = new Date(data.scheduled_date);
            var dd = datePost.getDate();
            var mm = datePost.getMonth() + 1;
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var yyyy = datePost.getFullYear();
            return dd + '/' + mm + '/' + yyyy + ' ' + data.scheduled_time;
        }

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
                    paramType = '';
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
                data.post_date = convertPostDateToSend(data);
                return $http.post(apiUrl + '/news', data, { ignoreLoadingBar: true });
            },
            updateNews: function (id, data) {
                data.post_date = convertPostDateToSend(data);
                return $http.put(apiUrl + '/news/' + id, data, { ignoreLoadingBar: true });
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
            if (type === 'news_agencia_de_agencia') {
                return '&query[filter][' + 98 + '][type]=innerjoin' +
                    '&query[filter][' + 98 + '][field]=type' +
                    '&query[filter][' + 98 + '][alias]=TNEWS' +
                    '&query[filter][' + 99 + '][type]=orx' +
                    '&query[filter][' + 99 + '][conditions][' + 0 + '][type]=eq' +
                    '&query[filter][' + 99 + '][conditions][' + 0 + '][field]=slug' +
                    '&query[filter][' + 99 + '][conditions][' + 0 + '][value]=agencia-de-noticias' +
                    '&query[filter][' + 99 + '][conditions][' + 0 + '][alias]=TNEWS' +
                    '&query[filter][' + 99 + '][conditions][' + 0 + '][where]=or' +
                    '&query[filter][' + 99 + '][conditions][' + 1 + '][type]=eq' +
                    '&query[filter][' + 99 + '][conditions][' + 1 + '][field]=highlightUfmg' +
                    '&query[filter][' + 99 + '][conditions][' + 1 + '][value]=1' +
                    '&query[filter][' + 99 + '][where]=and';
            }
            if (type === 'news_radio') {
                type = 'radio';
            } else if (type === 'news_tv') {
                type = 'tv';
            } else if (type === 'news_fique_atento') {
                type = 'fique-atento';
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
