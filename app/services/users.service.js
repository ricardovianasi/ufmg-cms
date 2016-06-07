;(function () {
  'use strict';

  angular.module('usersModule')
    .factory('UsersService', UsersService);

  UsersService.$inject = [
    '$http',
    'apiUrl'
  ];

  function UsersService($http, apiUrl) {
    console.log('... UsersService');

    return { 
      getUsers: function() {
        return $http.get(apiUrl+'/user');
      }
    };
  }
})();
