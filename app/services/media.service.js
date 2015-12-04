;(function () {
  'use strict';

  angular.module('ServiceModule')
    .factory('MediaService', [
      '$q',
      '$http',
      '$filter',
      'Upload',
      'SerializeService',
      '$httpParamSerializer',
      function ($q, $http, $filter, Upload, SerializeService, $httpParamSerializer) {
        console.log('... MediaService');

        var MEDIA_ENDPOINT = $filter('format')('{0}/{1}', APIUrl, 'file');

        return {
          getFile: function (id) {
            var deferred = $q.defer();

            $http.get(APIUrl + '/file/' + id).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          getIcons: function () {
            var deferred = $q.defer();

            $http.get(APIUrl + '/file/icon').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          getMedia: function (page) {
            page = page || 1;

            var deferred = $q.defer();
            var url = $filter('format')('{0}?page={1}', MEDIA_ENDPOINT, page);

            $http.get(url).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          removeMedia: function (id) {
            var deferred = $q.defer();

            $http.delete(APIUrl + '/file/' + id).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          cropImage: function (id, obj) {
            var deferred = $q.defer();
            obj = {
              x: parseInt(obj.x),
              y: parseInt(obj.y),
              width: parseInt(obj.width),
              height: parseInt(obj.height),
              resize_width: obj.resize_width,
              resize_height: obj.resize_height
            };
            $http.post(APIUrl + '/file/' + id + '/crop', $httpParamSerializer(obj), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          newFile: function (file) {
            var deferred = $q.defer();

            Upload.upload({
              url: APIUrl + '/file',
              fields: {
                title: file.title ? file.title : '',
                description: file.description ? file.description : '',
                altText: file.alt_text ? file.alt_text : '',
                legend: file.legend ? file.legend : ''
              },
              file: file
            }).progress(function (evt) {
              //
            }).success(function (data, status, headers, config) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          updateFile: function (id, obj) {
            var deferred = $q.defer();

            $http.put(APIUrl + '/file/' +
              id, obj).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
        };
      }
    ]);
})();
