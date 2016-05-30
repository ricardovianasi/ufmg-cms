;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('PostTypeService', PostTypeService);

  PostTypeService.$inject = [
    '$http',
    'apiUrl'
  ];

  function PostTypeService($http, apiUrl) {
    console.log('... PostTypeService');

    return {
      getPostTypes: function() {
        return $http.get(apiUrl+'/post-type');
      }
    };
  }
})();
