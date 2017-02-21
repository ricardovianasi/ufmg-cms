(function () {
    'use strict';

    angular
        .module('usersModule')
        .factory('UsersService', UsersService);

    /** ngInject */
    function UsersService($http, apiUrl, $log, $q) {
        $log.info('UsersService');

        return {
            getUsers: _getUsers,
            getUser: _getUser,
            saveUser: _saveUser,
            updateUser: _updateUser,
        };

        function _getUsers() {
            return $http.get(apiUrl + '/user');
        }

        function _getUser(id) {
            var url = apiUrl + '/user';
            if (id) {
                url = apiUrl + '/user/' + id;
            }
            return $http.get(url);
        }

        function _saveUser(data) {
            return $http.post(apiUrl + '/user', data);
        }

        function _updateUser(user) {
            var id = user.id;
            return $http.put(apiUrl + '/user/' + id, user);
        }
    }
})();
