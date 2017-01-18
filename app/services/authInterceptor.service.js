(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('authInterceptorService', authInterceptorService);

    /** ngInject */
    function authInterceptorService(sessionService, $q, $location, client_id_auth, apiUrl, $log) {
        return {
            request: _request,
            responseError: _responseError
        };

        function _request(config) {
            if (sessionService.verifyTokenIsExpired()) {

                var data = {
                    refresh_token: sessionService.getTokenRefresh(),
                    grant_type: 'refresh_token',
                    client_id: client_id_auth
                };

                // WTF! Fizeram o sistema de autenticação errado, e teve que fazer isso.
                $.ajax({
                    type: "POST",
                    url: apiUrl + '/authenticate',
                    data: data,
                }).done(function (res) {
                    $log.error('Chamada ajax inválida: ', res);
                    sessionService.saveData(res);
                });
            }
            var token = sessionService.getToken();

            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }

            return config;
        }

        function _responseError(response) {
            if (response.status === 401 || response.status === 403) {
                $location.path('/login');
            }
            return $q.reject(response);
        }
    }
})();
