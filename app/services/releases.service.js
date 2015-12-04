;(function () {
  'use strict';

  angular.module('ServiceModule')
    .factory('ReleasesService', [
      '$http',
      '$q',
      '$filter',
      'DateTimeHelper',
      'StatusService',
      function ($http, $q, $filter, DateTimeHelper, StatusService) {
        console.log('... ReleasesService');

        var RELEASE_ENDPOINT = $filter('format')('{0}/{1}', APIUrl, 'release');

        /**
         * @param {object} data
         *
         * @returns {object}
         *
         * @private
         */
        var _parseData = function (data) {
          if (data.thumb) {
            data.thumb = data.thumb.id;
          }

          var when = new Date(
            data.service.when.year,
            data.service.when.month
          );

          data.service.when = DateTimeHelper.toBrStandard(when);

          angular.forEach(data.files, function (value) {
            if (value.file !== '') {
              value.file = value.id;

              delete value.id;
            }

            delete value.opened;
          });

          if (data.status === StatusService.STATUS_SCHEDULED) {
            var scheduled = new Date(
              data.scheduled_at.year,
              data.scheduled_at.month,
              data.scheduled_at.day,
              data.scheduled_at.hour,
              data.scheduled_at.minute
            );

            data.scheduled_at = DateTimeHelper.toBrStandard(scheduled, true);
          }

          // If we are updating the Release
          if (data.id) {
            delete data.slug;
            delete data.created_at;
            delete data.udpated_at;
          }

          return data;
        };

        return {
          /**
           * @returns {*}
           */
          getReleases: function (page) {
            page = page || 1;

            var deferred = $q.defer();

            var url = $filter('format')('{0}?page={1}', RELEASE_ENDPOINT, page);

            $http.get(url).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param data
           *
           * @returns {*}
           */
          store: function (data) {
            var deferred = $q.defer();

            data = _parseData(data);

            $http.post(RELEASE_ENDPOINT, data).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param data
           * @param id
           *
           * @returns {*}
           */
          update: function (data, id) {
            var deferred = $q.defer();
            var url = $filter('format')('{0}/{1}', RELEASE_ENDPOINT, id);

            data = _parseData(data);

            $http.put(url, data).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           *
           * @returns {*}
           */
          destroy: function (id) {
            var deferred = $q.defer();
            var url = $filter('format')('{0}/{1}', RELEASE_ENDPOINT, id);

            $http.delete(url).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           *
           * @returns {*}
           */
          getRelease: function (id) {
            var deferred = $q.defer();
            var url = $filter('format')('{0}/{1}', RELEASE_ENDPOINT, id);

            $http.get(url).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
        };
      }
    ]);
})();
