;(function () {
  'use strict';

  angular.module('ServiceModule')
    .factory('StatusService', [
      '$http',
      '$q',
      function ($http, $q) {
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

            $http.get(APIUrl + '/status').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
        };
      }
    ]);
})();
