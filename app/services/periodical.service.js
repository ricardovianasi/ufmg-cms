;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('PeriodicalService', [
      '$q',
      '$http',
      '$filter',
      'apiUrl',
      function ($q, $http, $filter, apiUrl) {
        clog('... PeriodicalService');

        var APIUrl = apiUrl;
        var PERIODICAL_ENDPOINT = $filter('format')('{0}/{1}', APIUrl, 'periodical');

        return {
          /**
           * @param id
           *
           * @returns {*}
           */
          getPeriodicalEditions: function (id) {
            var deferred = $q.defer();

            $http.get(APIUrl + '/periodical/' + id + '/editions').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           * @param edition
           *
           * @returns {*}
           */
          getEdition: function (id, edition) {
            var deferred = $q.defer();

            $http.get(APIUrl + '/periodical/' + id + '/edition/' + edition).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           * @param data
           *
           * @returns {*}
           */
          newEdition: function (id, data) {
            var deferred = $q.defer();

            $http.post(APIUrl + '/periodical/' + id + '/edition', data).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           * @param edition
           * @param data
           *
           * @returns {*}
           */
          updateEdition: function (id, edition, data) {
            var deferred = $q.defer();

            $http.put(APIUrl + '/periodical/' + id + '/edition/' + edition, data).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           * @param edition
           *
           * @returns {*}
           */
          removeEdition: function (id, edition) {
            var deferred = $q.defer();

            $http.delete(APIUrl + '/periodical/' + id + '/edition/' + edition).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           * @param page
           *
           * @returns {*}
           */
          getPeriodicals: function (id, page) {
            page = page || 1;

            var deferred = $q.defer();
            var url = $filter('format')('{0}?page={1}', PERIODICAL_ENDPOINT, page);

            if (id) {
              url = $filter('format')('{0}/{1}', PERIODICAL_ENDPOINT, id);

              $http.get(url).then(function (data) {
                deferred.resolve(data);
              });

              return deferred.promise;
            }

            $http.get(APIUrl + '/periodical?page=' + page).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param data
           *
           * @returns {*}
           */
          newPeriodical: function (data) {
            var deferred = $q.defer();

            $http.post(APIUrl + '/periodical', data).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           * @param data
           *
           * @returns {*}
           */
          updatePeriodical: function (id, data) {
            var deferred = $q.defer();

            $http.put(APIUrl + '/periodical/' + id, data).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           *
           * @returns {*}
           */
          removePeriodical: function (id) {
            var deferred = $q.defer();

            $http.delete(APIUrl + '/periodical/' + id).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
        };
      }
    ]);
})();
