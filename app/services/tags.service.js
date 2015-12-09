;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('TagsService', [
      '$http',
      '$q',
      function ($http, $q) {
        console.log('... TagsService');

        return {
          getTags: function () {
            var deferred = $q.defer();

            $http.get(APIUrl + '/tag').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
        };
      }
    ]);
})();
