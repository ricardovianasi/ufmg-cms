(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('accountService', accountService);
    /**ngInject */
    function accountService($http, apiUrl, grant_type_auth, client_id_auth, $q, $rootScope) {
        $rootScope.isRequiredAccount = false;
        return {
            get: _get,
            edit: _edit
        };

        function _edit(user, id) {
            return $http.put(apiUrl + '/account/' + id, user);
        }

        function _get() {
            return $http.get(apiUrl + '/account');
        }
    }
})();
