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
            if(!response.data) {
                response.data = { status: response.status, detail: 'error_unknown' };
            }
            _handleTries(urlError);
            const objTry = _maxTry(response);
            if (objTry.cancelTry) {
                _emitResponseError(response);
                return $q.reject(response);
            } else {
                return _retryRequestHttp(response.config, objTry.wait);
            }
        }

        function _retryRequestHttp(config, wait) {
            let defer = $q.defer();
            $timeout(function() {
                let $http = $injector.get('$http');
                $http(config)
                    .then(function(data) { defer.resolve(data); })
                    .catch(function(error) { defer.reject(error); });
            }, wait);
            return defer.promise;
        }

        function _emitResponseError(response) {
            if (response.status === 401) {
                $rootScope.$broadcast('AuthenticateResponseError');
            } else if (response.status === 403) {
                $rootScope.$broadcast('Error403');
            } else if (response.status >= 500) {
                $rootScope.$broadcast('Error5xx', response);
            } else {
                $rootScope.$broadcast('ErrorUnknown');
            }
        }
        function _maxTry({ config, data }) {
            const key = btoa(config.url);
            const numberMaxTry = 3;
            const noTry = _noTry(data, config);
            console.log('noTry',{ noTry, data, config });
            let isMaxTry = angular.isDefined(requestTries[key]) && requestTries[key] >= numberMaxTry;
            if(isMaxTry || noTry) {
                requestTries[key] = 0;
                return { cancelTry: true };
            }
            return {
                cancelTry: false,
                wait: isFailed ? 4000 : 1000
            };
        }

        function _noTry(data, config) {
            const statusNoTry = data.status === 401 || data.status === 403;
            const methodNoTry = config.method !== 'GET';
            const isFailedTransaction = data.detail === 'There is no active transaction.';
            const isFailedUnknow = data.detail === 'error_unknown' && !statusNoTry;
            console.log({statusNoTry, methodNoTry, isFailedTransaction, isFailedUnknow});
            return (statusNoTry || methodNoTry) && (!isFailedTransaction && !isFailedUnknow);
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
