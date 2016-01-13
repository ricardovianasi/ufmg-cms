;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('TagsService', TagsService);

  TagsService.$inject = [
    '$http',
    '$q',
    'apiUrl'
  ];

  function TagsService($http, $q, apiUrl) {
    console.log('... TagsService');

    return {
      getTags: function () {
        var deferred = $q.defer();

        $http.get(apiUrl+'/tag').then(function (data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      }
    };
  }
})();
