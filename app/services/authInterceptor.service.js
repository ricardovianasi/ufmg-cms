;(function(){
  'use strict';

  angular
    .module('serviceModule')
    .factory('authInterceptorService', authInterceptorService);

  authInterceptorService.$inject = [
    'sessionService',
    '$q',
    '$location',
    'client_id_auth',
    'apiUrl'
  ];

  function authInterceptorService(sessionService, $q, $location, client_id_auth, apiUrl) {
    return {
      request: _request,
      responseError: responseError
    };


    /**
     *
     * @param config
     * @returns {*}
       * @private
       */
    function _request(config) {
      if(sessionService.verifyTokenIsExpired()) {
        var data  = {
          refresh_token: sessionService.getTokenRefresh(),
          grant_type: 'refresh_token',
          client_id: client_id_auth
        };

        $.ajax({
          type:"POST",
          url: apiUrl + '/authenticate',
          data: data,
        }).done(function(res) {
          sessionService.saveData(res);
        });
      }



      var token = sessionService.getToken();

      if(token) {
        config.headers = config.headers || {};
        config.headers.Authorization =  'Bearer ' + token;
      }

      return config;
    }


    function responseError(response) {
      if (response.status === 401 || response.status === 403) {
        $location.path('/login');
      }
      return $q.reject(response);
    }
  }
})();
