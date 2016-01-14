;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('StatusService', [
      '$http',
      '$q',
      'apiUrl',
      function ($http, $q, apiUrl) {
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
    ]);
})();
