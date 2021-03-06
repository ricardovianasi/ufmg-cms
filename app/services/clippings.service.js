(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('ClippingsService', function ($http, $q, $filter, DateTimeHelper, apiUrl, $log) {
            $log.info('ClippingsService');

            var APIUrl = apiUrl;
            var CLIPPING_ENDPOINT = $filter('format')('{0}/{1}', APIUrl, 'clipping');

            var _parseData = function (data) {
                var date = new Date(
                    data.date.year,
                    data.date.month,
                    data.date.day
                );

                return {
                    id: data.id || null,
                    status: data.status,
                    origin: data.origin,
                    date: DateTimeHelper.toBrStandard(date, true),
                    title: data.title,
                    url: data.url
                };
            };

            return {
                getClippings: function (params) {
                    if (angular.isUndefined(params)) {
                        params = '';
                    }
                    return $http.get(apiUrl + '/clipping' + params);
                },
                store: function (data) {
                    data = _parseData(data);
                    return $http.post(CLIPPING_ENDPOINT, data, { ignoreLoadingBar: true });
                },
                update: function (data, id) {
                    var url = $filter('format')('{0}/{1}', CLIPPING_ENDPOINT, id);
                    data = _parseData(angular.copy(data));
                    return $http.put(url, data, { ignoreLoadingBar: true });
                },
                destroy: function (id) {
                    var deferred = $q.defer();
                    var url = $filter('format')('{0}/{1}', CLIPPING_ENDPOINT, id);

                    $http.delete(url).then(function (data) {
                        deferred.resolve(data);
                    });

                    return deferred.promise;
                },
                getClipping: function (id) {
                    var deferred = $q.defer();
                    var url = $filter('format')('{0}/{1}', CLIPPING_ENDPOINT, id);

                    $http.get(url).then(function (data) {
                        deferred.resolve(data);
                    });

                    return deferred.promise;
                }
            };
        });
})();
