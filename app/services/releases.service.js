;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('ReleasesService', ReleasesService);

  ReleasesService.$inject = [
    '$http',
    '$q',
    '$filter',
    'DateTimeHelper',
    'StatusService',
    'apiUrl'
  ];

  function ReleasesService($http, $q, $filter, DateTimeHelper, StatusService, apiUrl) {
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
        authorName: data.authorName
      };

      var when = new Date(
        data.service.when.year,
        data.service.when.month - 1,
        data.service.when.day
      );

      obj.service.when = DateTimeHelper.toBrStandard(when);

      angular.forEach(data.files, function (value) {
        var file = value;

        if (value.file !== '') {
          file.file = value.id;
        }

        obj.files.push(file);
      });

      if (data.status === StatusService.STATUS_SCHEDULED) {
        var scheduled = new Date(
          data.scheduled_at.year,
          data.scheduled_at.month,
          data.scheduled_at.day,
          data.scheduled_at.hour,
          data.scheduled_at.minute
        );

        obj.scheduled_at = DateTimeHelper.toBrStandard(scheduled, true);
      }

      clog('obj >>>', obj);

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
