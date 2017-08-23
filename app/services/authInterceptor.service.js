(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('authInterceptorService', authInterceptorService);

    /** ngInject */
    function authInterceptorService(sessionService, $q, $location, $cookies, client_id_auth, apiUrl, $log, $rootScope) {
        return {
            request: _request,
            responseError: _responseError
        };


        function _setCookieIsLoggedCMS() {
            var tenMinutusLater = new Date((new Date()).getTime() + 10000 * 60);
            var options = {
                path: '/',
                domain: $location.host(),
                expires: tenMinutusLater,
                secure: false
            };
            $cookies.putObject('isLoggedCMS', true, options);
        };

        function _request(config) {
            var token = sessionService.getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }
            _setCookieIsLoggedCMS();
            return config;
        }

        function _responseError(response) {
            if (response.status === 401 || response.status === 403) {
                $rootScope.$broadcast('AuthenticateResponseError');
            }
            return $q.reject(response);
        }
    }
})();
