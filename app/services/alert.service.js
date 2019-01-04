(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('AlertService', AlertService);

    /** ngInject */
    function AlertService(apiUrl, $http) {
        let baseUrl = `${apiUrl}/alert`;

        var service = {
            listAlerts:listAlerts,
            alert:alert,
            remove: remove,
            save: save
        };

        return service;

        ////////////////
        function listAlerts(params = '') {
            let url = `${baseUrl}${params}`;
            return $http.get(baseUrl);
        }

        function alert(id) {
            let url = `${baseUrl}/${id}`;
            return $http.get(url);
        }

        function  remove(id) {
            let url = `${baseUrl}/${id}`;
            return $http.get(url);
        }

        function save(data) {
            let url = `${baseUrl}/${id}`;
            if (id in data) {
                return $http.put(url, data);
            }
            return $http.post(baseUrl, data);
        }
    }
})();
