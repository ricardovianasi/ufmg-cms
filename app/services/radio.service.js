(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('RadioService', RadioService);

    /** ngInject */
    function RadioService($http, $q, apiUrl) {
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
            let url = apiUrl + '/radio-programming' + (params || '');
            return $http.get(url);
        }

        function program(idProgram) {

        }

        function radioProgramming() {

        }

        function registerProgram(data) {

        }

        function updateProgram(data) {

        }

        function updateRadioProgramming(data) {

        }
    }
})();