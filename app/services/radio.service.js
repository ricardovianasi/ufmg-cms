(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('RadioService', RadioService);

    /** ngInject */
    function RadioService($http, apiUrl, dataTableConfigService, BuildParamsService, SerializeService) {
        let baseUrlGenre = apiUrl + '/radio-genre';
        let baseUrlParent = apiUrl + '/radio-schedule';
        let baseUrlProgram = apiUrl + '/radio-programming';
        let baseUrlGrid = apiUrl + '/radio-programming-grid';
        let baseUrlRadioThumb = apiUrl + '/radio-thumb';

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
            baseUrlParent: baseUrlParent,
            saveThumbnail: saveThumbnail,
            hasScheduleBusy: hasScheduleBusy,
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

        function hasScheduleBusy(idProgram, weekDay, timeStart, timeEnd) {
            let params = _buildParamsScheduleBusy(idProgram, weekDay, timeStart, timeEnd);
            let url = baseUrlGrid + '?' + params;
            console.log(params);
            return $http.get(url);
        }

        function _buildParamsScheduleBusy(idProgram, weekDay, timeStart, timeEnd) {
            let params = BuildParamsService.getPureElement(['page', 'page_size'], [1, 1]);
            params += BuildParamsService.getInnerJoin(1, 'program');
            params += BuildParamsService.getParamToSearch('eq', 'weekDay', weekDay, '', 'and', 2);
            let index = 3;
            if(idProgram) {
                params += BuildParamsService.getParamToSearch('neq', 'id', idProgram, 'program', 'and', index);
                index++;
            }
            params += BuildParamsService.getQueryFilter(index) + BuildParamsService.getElement('type', 'orx');
            params += _getParamDate(timeStart, timeEnd, 'timeStart', index, 1);
            params += _getParamDate(timeStart, timeEnd, 'timeEnd', index, 2);
            return params;
        }

        function _getParamDate(timeStart, timeEnd, field, filterIndex, conditionsIndex) {
            let params = [ {name: 'type', value: 'between'}, {name: 'field', value: field},
                {name: 'from', value: timeStart}, {name: 'to', value: timeEnd},
                {name: 'format', value: 'H:i'}, {name: 'where', value: 'or'} ];
            return BuildParamsService.getParamsFilter(params, filterIndex, conditionsIndex);
        }

        function _getParamsOrderGrid() {
            dataTableConfigService.setColumnsHasOrderAndSearch([]);
            return {
                order_by: { field: 'timeStart', direction: 'ASC' },
            };
        }

        function saveThumbnail(idProgram, idImage) {
            let params = { id: idProgram, thumb: idImage };
            let url = baseUrlRadioThumb + '?' + SerializeService.parseParams(params);
            return $http.get(url);
        }
    }
})();