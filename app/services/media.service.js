;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('MediaService', MediaService);

  MediaService.$inject = [
    '$q',
    '$http',
    '$filter',
    'Upload',
    '$httpParamSerializer',
    'apiUrl',
  ];

  /**
   * @param $q
   * @param $http
   * @param $filter
   * @param Upload
   * @param $httpParamSerializer
   * @param apiUrl
   *
   * @returns {{getFile: getFile, getIcons: getIcons, getMedia: getMedia, removeMedia: removeMedia, cropImage: cropImage, newFile: newFile, updateFile: updateFile}}
   *
   * @constructor
   */
  function MediaService($q, $http, $filter, Upload, $httpParamSerializer, apiUrl) {
    clog('... MediaService');

    var MEDIA_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'file');
    var PAGE = 1;
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
       * @param page_size
       * @param search
       *
       * @returns {*}
       */
      getMedia: function (page, page_size, search) {
        var obj = {
          page: page || PAGE,
          page_size: page_size || PAGE_SIZE
        };

        if (typeof search != 'undefined') {
          obj.search = search;
        }

        var queryString = $filter('queryString')(obj);
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
})();
