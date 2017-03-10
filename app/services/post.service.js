(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('PostTypeService', PostTypeService);

    /** ngInject */
    function PostTypeService($http, apiUrl, $log) {
        $log.info('PostTypeService');

        return {
            getPostTypes: function () {
                return $http.get(apiUrl + '/post-type');
            }
        };
    }
})();
