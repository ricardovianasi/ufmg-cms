;(function(){
  'use strict';

  angular
    .module('serviceModule')
    .factory('authInterceptorService', authInterceptorService);

  authInterceptorService.$inject = ['sessionService'];

  function authInterceptorService(sessionService) {
    return {
      request: _request
    };


    /**
     *
     * @param config
     * @returns {*}
       * @private
       */
    function _request(config) {
      var token = sessionService.getToken();

      if(token) {
        config.headers = config.headers || {};
        config.headers.Authorization =  'Bearer ' + token;
      }

      return config;
    }
  }
})();
