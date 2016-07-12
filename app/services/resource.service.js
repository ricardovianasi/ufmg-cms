;(function () {
  'use strict';

  angular.module('usersModule')
    .factory('ResourcesService', ResourcesService);

  ResourcesService.$inject = [
    '$http',
    'apiUrl'
  ];

  function ResourcesService($http, apiUrl) {
    console.log('... ResourcesService');

    return {
      get: function() {
        return $http.get(apiUrl+'/resource');
      }
    };
  }
})();
