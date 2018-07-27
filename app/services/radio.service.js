(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('RadioService', RadioService);

    /** ngInject */
    function RadioService($http, $q, apiUrl) {
        let baseUrl = apiUrl + '/radio-programming';

        let service = {
            listPrograms: listPrograms,
            program: program,
            radioProgramming: radioProgramming,
            registerProgram: registerProgram,
            updateProgram: updateProgram,
            updateRadioProgramming: updateRadioProgramming,
        };
        
        return service;

        ////////////////
        function listPrograms(params) {
            let url = baseUrl + (params || '');
            return $http.get(url);
        }

        function program(idProgram) {
            let url = baseUrl + '/' + idProgram;
            return $http.get(url)
                .then(function(data) {
                    return data.data;
                });
        }

        function radioProgramming() {
            let url = baseUrl + '-grid';
            return $http.get(url);
        }

        function registerProgram(data) {
            return $http.post(baseUrl, data);
        }

        function updateProgram(data, id) {
            let url = baseUrl + '/' + id;
            return $http.post(url, data);
        }

        function updateRadioProgramming(data) {

        }
    }
})();