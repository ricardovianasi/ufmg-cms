(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('authInterceptorService', authInterceptorService);

    /** ngInject */
    function authInterceptorService(
        sessionService,
        $q,
        $location,
        $cookies,
        client_id_auth,
        apiUrl,
        $log,
        $rootScope,
        $injector,
        $timeout
    ) {
        let requestTries = {};

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
        }

        function _request(config) {
            var token = sessionService.getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }
            _setCookieIsLoggedCMS();
            $rootScope.$broadcast('httpRequest', config);
            return config;
        }

        function _responseError(response) {
            let urlError = response.config.url;
            let statusRequest = response.status;
            _handleTries(urlError);
            if (_maxTry(urlError, statusRequest)) {
                _emitResponseError(statusRequest);
                return $q.reject(response);
            } else {
                return _retryRequestHttp(response.config);
            }
        }
        
        function _retryRequestHttp(config) {
            let defer = $q.defer();
            $timeout(function() {
                let $http = $injector.get('$http');
                $http(config)
                    .then(function(data) { defer.resolve(data); })
                    .catch(function(error) { defer.reject(error); });
            }, 1000);
            return defer.promise;
        }

        function _emitResponseError(status) {
            if (status === 401) {
                $rootScope.$broadcast('AuthenticateResponseError');
            } else if (status === 403) {
                $rootScope.$broadcast('Error403');
            } else if (status >= 500) {
                $rootScope.$broadcast('Error5xx');
            } else {
                $rootScope.$broadcast('ErrorUnknown');
            }
        }

        function _maxTry(url, status) {
            let key = btoa(url);
            let numberMaxTry = 3;
            let noTry = status === 401 || status === 403;
            let isMaxTry = angular.isDefined(requestTries[key]) && requestTries[key] >= numberMaxTry;
            if(isMaxTry || noTry) {
                requestTries[key] = 0;
                return true;
            }
            return false;
        }

        function _handleTries(url) {
            if(!url.startsWith('http')) {
                return;
            }
            let key = btoa(url);
            if(angular.isDefined(requestTries[key])) {
                requestTries[key]++; 
            } else {
                requestTries[key] = 1;
            }
        }
    }
})();
