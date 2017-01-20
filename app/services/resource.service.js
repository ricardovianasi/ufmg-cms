(function () {
    'use strict';

    angular.module('usersModule')
        .factory('ResourcesService', ResourcesService);

    /** ngInject */
    function ResourcesService($http, apiUrl, $log) {
        $log.info('... ResourcesService');

        return {
            get: _get
        };

        function _get() {
            return $http.get(apiUrl + '/resource');
        }
    }
})();
