;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('MediaService', [
      '$q',
      '$http',
      '$filter',
      'Upload',
      'SerializeService',
      '$httpParamSerializer',
      'apiUrl',
      function ($q, $http, $filter, Upload, SerializeService, $httpParamSerializer, apiUrl) {
        console.log('... MediaService');

        var MEDIA_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'file');
        var PAGE_SIZE = 30;

        return {
          /**
           * @param id
           *
           * @returns {*}
           */
          getFile: function (id) {
            return $http.get(apiUrl+'/file/'+id);
          },
          /**
           * @returns {*}
           */
          getIcons: function () {
            return $http.get(apiUrl+'/file/icon');
          },
          /**
           * @param page
           *
           * @returns {*}
           */
          getMedia: function (page) {
            page = page || 1;

            var queryString = $filter('queryString')({
              page: page,
              page_size: PAGE_SIZE
            });
            var url = $filter('format')('{0}?{1}', MEDIA_ENDPOINT, queryString);

            return $http.get(url);
          },
          /**
           * @param id
           *
           * @returns {*}
           */
          removeMedia: function (id) {
            return $http.delete(apiUrl+'/file/'+id);
          },
          /**
           * @param id
           * @param {Object} obj
           *
           * @returns {*}
           */
          cropImage: function (id, obj) {
            obj = {
              x: parseInt(obj.x),
              y: parseInt(obj.y),
              width: parseInt(obj.width),
              height: parseInt(obj.height),
              resize_width: obj.resize_width,
              resize_height: obj.resize_height
            };

            return $http.post(apiUrl+'/file/'+id+'/crop', $httpParamSerializer(obj), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            });
          },
          /**
           *
           * @param file
           *
           * @returns {*}
           */
          newFile: function (file) {
            var deferred = $q.defer();

            Upload.upload({
              url: apiUrl+'/file',
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
          /**
           * @param id
           * @param obj
           *
           * @returns {*}
           */
          updateFile: function (id, obj) {
            return $http.put(apiUrl+'/file/'+id, obj);
          }
        };
      }
    ]);
})();
