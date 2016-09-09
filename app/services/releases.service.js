;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('ReleasesService', ReleasesService);

  ReleasesService.$inject = [
    '$http',
    '$filter',
    'DateTimeHelper',
    'StatusService',
    'apiUrl'
  ];

  /**
   * @param $http
   * @param $filter
   * @param DateTimeHelper
   * @param StatusService
   * @param apiUrl
   *
   * @returns {{getReleases: getReleases, store: store, update: update, destroy: destroy, getRelease: getRelease}}
   *
   * @constructor
   */
  function ReleasesService($http, $filter, DateTimeHelper, StatusService, apiUrl) {
    console.log('... ReleasesService');

    var RELEASE_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'release');

    /**
     * @param {object} data
     *
     * @returns {object}
     *
     * @private
     */
    var _parseData = function (data) {

      var slug = typeof data.slug != 'undefined' ?  data.slug.slug : '';

      var obj = {
        id: data.id || null,
        title: data.title,
        subtitle: data.subtitle,
        thumb: data.thumb ? data.thumb.id : null,
        content: data.content,
        source: data.source,
        service: data.service,
        files: [],
        status: data.status,
        authorName: data.authorName,
        slug: slug
      };


      angular.forEach(data.files, function (value) {
        // TODO DELETE COMMENT
        var file = value;

        if (value.file !== '') {
          file.file = value.id;
        }

        obj.files.push(file);
      });

      if (data.status === StatusService.STATUS_SCHEDULED) {
        obj.post_date = data.scheduled_date + ' ' + data.scheduled_time;
      }

      return obj;
    };

    return {
      /**
       * @returns {*}
       */
      getReleases: function (page) {
        page = page || 1;

        var url = $filter('format')('{0}?page={1}', RELEASE_ENDPOINT, page);

        return $http.get(url);
      },
      /**
       * @param data
       *
       * @returns {*}
       */
      store: function (data) {
        data = _parseData(data);

        return $http.post(RELEASE_ENDPOINT, data);
      },
      /**
       * @param data
       * @param id
       *
       * @returns {*}
       */
      update: function (data, id) {
        var url = $filter('format')('{0}/{1}', RELEASE_ENDPOINT, id);

        data = _parseData(data);

        return $http.put(url, data);
      },
      /**
       * @param id
       *
       * @returns {*}
       */
      destroy: function (id) {
        var url = $filter('format')('{0}/{1}', RELEASE_ENDPOINT, id);

        return $http.delete(url);
      },
      /**
       * @param id
       *
       * @returns {*}
       */
      getRelease: function (id) {
        var url = $filter('format')('{0}/{1}', RELEASE_ENDPOINT, id);

        return $http.get(url);
      }
    };
  }
})();
