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

        }

        function radioProgramming() {
            let url = baseUrl + '/all-grid';
            return $http.get(url);
        }

        function registerProgram(data) {
            return $http.post(baseUrl, data);
        }

        function updateProgram(data) {

        }

        function updateRadioProgramming(data) {

        }
    }
})();