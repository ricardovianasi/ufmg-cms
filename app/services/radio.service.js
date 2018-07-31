(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('RadioService', RadioService);

    /** ngInject */
    function RadioService($http, $q, apiUrl) {
        let baseUrlCategory = apiUrl + '/radio-genre';
        let baseUrlProgram = apiUrl + '/radio-programming';
        let baseUrlGrid = apiUrl + '/radio-programming-grid';

        let service = {
            listPrograms: listPrograms,
            program: program,
            radioProgramming: radioProgramming,
            registerProgram: registerProgram,
            updateProgram: updateProgram,
            updateProgramGrid: updateProgramGrid,
            registerProgramGrid: registerProgramGrid,
            deleteProgramGrid: deleteProgramGrid,
            listCategory: listCategory,
            updateCategory: updateCategory,
            registerCategory: registerCategory,
            deleteCategory: deleteCategory,
        };
        
        return service;

        ////////////////
        function listPrograms(params) {
            let url = baseUrlProgram + (params || '');
            return $http.get(url);
        }

        function program(idProgram) {
            let url = baseUrlProgram + '/' + idProgram;
            return $http.get(url)
                .then(function(data) {
                    return data.data;
                });
        }

        function registerProgram(data) {
            return $http.post(baseUrlProgram, data);
        }

        function updateProgram(data, id) {
            let url = baseUrlProgram + '/' + id;
            return $http.post(url, data);
        }

        function radioProgramming() {
            return $http.get(baseUrlGrid);
        }

        function updateProgramGrid(data, id) {
            let url = baseUrlGrid + '/' + id;
            return $http.put(url, data);
        }

        function deleteProgramGrid(id) {
            let url = baseUrlGrid + '/' + id;
            return $http.delete(url);
        }

        function registerProgramGrid(data) {
            return $http.post(baseUrlGrid, data);
        }

        function listCategory(params) {
            let url = baseUrlCategory + (params || '');
            return $http.get(url);
        }

        function updateCategory(data, id) {
            let url = baseUrlCategory + '/' + id;
            return $http.put(url, data);
        }

        function registerCategory(data) {
            return $http.post(baseUrlCategory, data);
        }

        function deleteCategory(id) {
            let url = baseUrlCategory + '/' + id;
            return $http.delete(url);
        }
    }
})();