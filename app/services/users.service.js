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
            updateUser: _updateUser
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
            var defer = $q.defer();
            console.log(angular.toJson(data));
            defer.resolve(true);
            return defer.promise;
            // return $http.post(apiUrl + '/user', data);
        }

        function _updateUser(data) {
            var id = data.id;
            console.log(angular.toJson(data));
            // return $http.put(apiUrl + '/user/' + id, data);
        }

        function _delete(id) {
            console.log(angular.toJson(data));
            // return $http.delete(apiUrl + '/user/' + id);
        }
    }
})();
