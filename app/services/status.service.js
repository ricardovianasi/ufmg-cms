;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('StatusService', StatusService);

  StatusService.$inject = [
    '$http',
    '$q',
    'apiUrl',
  ];

  /**
   * @param $http
   * @param $q
   * @param apiUrl
   *
   * @returns {{STATUS_PUBLISHED: string, STATUS_DRAFT: string, STATUS_AUTO_DRAFT: string, STATUS_TRASH: string, STATUS_SCHEDULED: string, STATUS_PENDING: string, getStatus: getStatus}}
   *
   * @constructor
   */
  function StatusService($http, $q, apiUrl) {
    console.log('... StatusService');

    return {
      STATUS_PUBLISHED: 'published',
      STATUS_DRAFT: 'draft',
      STATUS_AUTO_DRAFT: 'auto_draft',
      STATUS_TRASH: 'trash',
      STATUS_SCHEDULED: 'scheduled',
      STATUS_PENDING: 'pending_review',
      /**
       * @returns {*}
       */
      getStatus: function () {
        var deferred = $q.defer();

        $http.get(apiUrl + '/status').then(function (data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      }
    };
  }
})();
