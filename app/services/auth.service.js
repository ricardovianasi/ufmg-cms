(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('authService', authService);
    /**ngInject */
    function authService($http, apiUrl, grant_type_auth, client_id_auth, $q, $rootScope, sessionService) {
        var defer = $q.defer();
        $rootScope.isRequiredAccount = false;
        return {
            autenticate: _autenticate,
            account: _account,
            get: _get,
            refresh: _refresh
        };

        function _autenticate(credentials, rememberMe) {
            var data = {
                username: credentials.username,
                password: credentials.password,
                grant_type: grant_type_auth,
                client_id: client_id_auth
            };
            return $http.post(apiUrl + '/authenticate', data)
                .then(function(res) {
                    sessionService.saveData(res.data, rememberMe);
                    return _get();
                })
                .then(function(resAccount) { return resAccount.data; });
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
                    return _get();
                }
            }
            return defer.promise;
        }

        function _setUserRootScope(resAccount) {
            var user = resAccount.data;
            $rootScope.dataUser = resAccount;
            $rootScope.User = $rootScope.dataUser.data;
            $rootScope.User.term_signed = user.is_administrator || user.term_signed;
            $rootScope.User.term_signed = true;
        }

        function _get() {
            return $http.get(apiUrl + '/account')
                .then(function(resAccount) {
                    _setUserRootScope(resAccount);
                    return resAccount;
                });
        }
    }
})();
