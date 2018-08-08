(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('RadioService', RadioService);

    /** ngInject */
    function RadioService($http, $q, apiUrl, dataTableConfigService) {
        let baseUrlGenre = apiUrl + '/radio-genre';
        let baseUrlCategory = apiUrl + '/radio-category';
        let baseUrlProgram = apiUrl + '/radio-programming';
        let baseUrlGrid = apiUrl + '/radio-programming-grid';

        let service = {
            listPrograms: listPrograms,
            program: program,
            radioProgramming: radioProgramming,
            registerProgram: registerProgram,
            updateProgram: updateProgram,
            updateProgramGrid: updateProgramGrid,
            deleteProgram: deleteProgram,
            registerProgramGrid: registerProgramGrid,
            deleteProgramGrid: deleteProgramGrid,
            listItemFilter: listItemFilter,
            updateItemFilter: updateItemFilter,
            registerItemFilter: registerItemFilter,
            deleteItemFilter: deleteItemFilter,
            baseUrlGenre: baseUrlGenre,
            baseUrlCategory: baseUrlCategory
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
            return $http.put(url, data);
        }

        function deleteProgram(id) {
            let url = baseUrlProgram + '/' + id;
            return $http.delete(url);
        }

        function radioProgramming() {
            let params = dataTableConfigService.getParams(_getParamsOrderGrid());
            let url = baseUrlGrid + params;
            return $http.get(url);
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

        function listItemFilter(params, urlItem) {
            let url = urlItem + (params || '');
            return $http.get(url);
        }

        function updateItemFilter(data, id, urlItem) {
            let url = urlItem + '/' + id;
            return $http.put(url, data);
        }

        function registerItemFilter(data, urlItem) {
            return $http.post(urlItem, data);
        }

        function deleteItemFilter(id, urlItem) {
            let url = urlItem + '/' + id;
            return $http.delete(url);
        }

        function _getParamsOrderGrid() {
            dataTableConfigService.setColumnsHasOrderAndSearch([]);
            return {
                order_by: { field: 'timeStart', direction: 'ASC' },
            };
        }
    }
})();