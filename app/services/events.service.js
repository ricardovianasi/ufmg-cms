;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('EventsService', EventsService);

  EventsService.$inject = [
    '$http',
    '$filter',
    'DateTimeHelper',
    'apiUrl'
  ];

  /**
   * @param $http
   * @param $filter
   * @param DateTimeHelper
   * @param apiUrl
   *
   * @returns {{getEvents: getEvents, getEventsCategories: getEventsCategories, store: store, update: update, destroy: destroy, getEvent: getEvent}}
   *
   * @constructor
   */
  function EventsService($http, $filter, DateTimeHelper, apiUrl) {
    console.log('... EventsService');

    var EVENT_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'event');

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
        delete data.author;
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

        var url = $filter('format')('{0}?page={1}', EVENT_ENDPOINT, page);

        return $http.get(url);
      },
      /**
       * @returns {*}
       */
      getEventsCategories: function () {
        var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, 'category');

        return $http.get(url);
      },
      /**
       * @param data
       *
       * @returns {*}
       */
      store: function (data) {
        data = _parseData(data);

        return $http.post(EVENT_ENDPOINT, data);
      },
      /**
       * @param data
       * @param id
       *
       * @returns {*}
       */
      update: function (data, id) {
        var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

        data = _parseData(data);

        return $http.put(url, data);
      },
      /**
       * @param id
       *
       * @returns {*}
       */
      destroy: function (id) {
        var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

        return $http.delete(url);
      },
      /**
       * @param id
       *
       * @returns {*}
       */
      getEvent: function (id) {
        var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

        return $http.get(url);
      }
    };
  }
})();
