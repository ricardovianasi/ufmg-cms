(function () {
    'use strict';

    angular
        .module('usersModule')
        .factory('UsersService', UsersService);

    /** ngInject */
    function UsersService($http, apiUrl, $log) {
        $log.info('UsersService');

        return {
            getUsers: _getUsers,
            getUser: _getUser,
            saveUser: _saveUser,
            updateUser: _updateUser
        };

        function _getUsers(params) {
            if (angular.isUndefined(params)) {
                params = '';
            }
            return $http.get(apiUrl + '/user' + params);
        }

        function _getUser(id) {
            $log.info('getUser ID', id);
            var url = apiUrl + '/user';
            if (id) {
                url = apiUrl + '/user/' + id;
            }
            return $http.get(url);
        }

        function _saveUser(data) {
            $log.info('saveUser data', data);
            return $http.post(apiUrl + '/user', data);
        }

        function _updateUser(user) {
            $log.info('updateUser user', user);
            var id = user.id;
            return $http.put(apiUrl + '/user/' + id, user);
        }
    }
})();
