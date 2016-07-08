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
      },

      getUser: function(id) {
        var url = apiUrl + '/user';

        if(id)
          url =  apiUrl + '/user/' + id;

        return $http.get(url);
      },

      saveUser: function (data) {
        return $http.post(apiUrl + '/user', data);
      },

      updateUser: function (data) {
        var id = data.id;
        return $http.put(apiUrl + '/user/' + id, data);
      }
    };
  }
})();
