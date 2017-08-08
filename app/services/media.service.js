(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('MediaService', MediaService);

    /** ngInject */
    function MediaService($q, $http, $filter, Upload, $httpParamSerializer, apiUrl, $log) {
        $log.info('MediaService');

        var MEDIA_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'file');

        return {
            getFile: function (id) {
                return $http.get(apiUrl + '/file/' + id);
            },
            getIcons: function () {
                return $http.get(apiUrl + '/file/icon');
            },
            getMedia: function (params) {
                if (angular.isUndefined(params)) {
                    params = '';
                }
                var url = $filter('format')('{0}{1}', MEDIA_ENDPOINT, params);

                return $http.get(url);
            },
            getMedias: function (params, ignoreLoadingBar) {
                if (angular.isUndefined(params)) {
                    params = '';
                }
                var url = $filter('format')('{0}{1}', MEDIA_ENDPOINT, params);
                return $http.get(url, {
                    ignoreLoadingBar: ignoreLoadingBar
                });
            },
            removeMedia: function (id) {
                return $http.delete(apiUrl + '/file/' + id);
            },
            cropImage: function (id, obj) {
                obj = {
                    x: parseInt(obj.x),
                    y: parseInt(obj.y),
                    width: parseInt(obj.width),
                    height: parseInt(obj.height),
                    resize_width: obj.resize_width,
                    resize_height: obj.resize_height
                };

                return $http.post(apiUrl + '/file/' + id + '/crop', $httpParamSerializer(obj), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            newFile: function (file) {
                var deferred = $q.defer();
                
                Upload.upload({
                    url: apiUrl + '/file',
                    fields: {
                        title: file.title || '',
                        description: file.description || '',
                        altText: file.alt_text || '',
                        legend: file.legend || ''
                    },
                    file: file
                }).success(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            updateFile: function (id, obj) {
                return $http.put(apiUrl + '/file/' + id, obj);
            }
        };
    }
})();
