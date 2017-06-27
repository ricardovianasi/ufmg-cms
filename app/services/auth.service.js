(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('authService', authService);
    /**ngInject */
    function authService($http, apiUrl, grant_type_auth, client_id_auth, $q, $rootScope) {
        var defer = $q.defer();
        $rootScope.isRequiredAccount = false;
        return {
            autenticate: _autenticate,
            account: _account,
            get: _get,
            refresh: _refresh
        };

        function _autenticate(credentials) {
            var data = {
                username: credentials.username,
                password: credentials.password,
                grant_type: grant_type_auth,
                client_id: client_id_auth
            };
            return $http.post(apiUrl + '/authenticate', data);
        }

        function _refresh(refreshToken) {
            var data = {
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                client_id: client_id_auth
            };
            return $http.post(apiUrl + '/authenticate', data);
        }

        function _account() {
            if (angular.isDefined($rootScope.dataUser)) {
                $rootScope.User = $rootScope.dataUser.data;
                defer.resolve($rootScope.dataUser);
            } else {
                if (!$rootScope.isRequiredAccount) {
                    $rootScope.isRequiredAccount = true;
                    _get().then(function (res) {
                        $rootScope.dataUser = res;
                        $rootScope.User = $rootScope.dataUser.data;
                        defer.resolve(res);
                    });
                }
            }
            return defer.promise;
        }

        function _get() {
            return $http.get(apiUrl + '/account');
        }
    }
})();
