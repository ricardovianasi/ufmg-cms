;(function () {
  'use strict';

  angular.module('ServiceModule')
    .factory('EventsService', [
      '$http',
      '$q',
      '$filter',
      'DateTimeHelper',
      function ($http, $q, $filter, DateTimeHelper) {
        console.log('... EventsService');

        var EVENT_ENDPOINT = $filter('format')('{0}/{1}', APIUrl, 'event');

        /**
         * @param {object} data
         *
         * @returns {object}
         *
         * @private
         */
        var _parseData = function (data) {
          if (data.photo) {
            data.photo = data.photo.id;
          }

          if (data.poster) {
            data.poster = data.poster.id;
          }

          var initTime = new Date(data.initTime);
          var endTime = new Date(data.endTime);

          data.initDate = new Date(data.initDate);
          data.initDate.setHours(initTime.getHours(), initTime.getMinutes());

          data.endDate = new Date(data.endDate);
          data.endDate.setHours(endTime.getHours(), endTime.getMinutes());

          data.initDate = DateTimeHelper.toBrStandard(data.initDate, true);
          data.endDate = DateTimeHelper.toBrStandard(data.endDate, true);

          delete data.initTime;
          delete data.endTime;

          // If we are updating the Event
          if (data.id) {
            delete data.slug;
            delete data.created_at;
            delete data.updated_at;
          }

          if (data.status == 'scheduled') {
            data.scheduled_at = data.scheduled_date + ' ' + data.scheduled_time;
            delete data.scheduled_date;
            delete data.scheduled_time;
          }

          return data;
        };

        return {
          /**
           * @returns {*}
           */
          getEvents: function (page) {
            page = page || 1;

            var deferred = $q.defer();
            var url = $filter('format')('{0}?page={1}', EVENT_ENDPOINT, page);

            $http.get(url).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @returns {*}
           */
          getEventsCategories: function () {
            var deferred = $q.defer();
            var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, 'category');

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

            $http.post(EVENT_ENDPOINT, data).then(function (data) {
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
            var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

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
            var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

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
          getEvent: function (id) {
            var deferred = $q.defer();
            var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

            $http.get(url).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
        };
      }
    ]);
})();
