;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('authService', authService);

  authService.$inject = [
    '$http',
    'apiUrl',
    'grant_type_auth',
    'client_id_auth'
  ];

  function authService($http, apiUrl, grant_type_auth, client_id_auth) {


    return {
      autenticate: _autenticate
    };

    function _autenticate(credentials) {
      var data  = {
        username: credentials.username,
        password: credentials.password,
        grant_type: grant_type_auth,
        client_id: client_id_auth
      };

      return $http.post(apiUrl + '/authenticate', data);
    }
  }
})();
