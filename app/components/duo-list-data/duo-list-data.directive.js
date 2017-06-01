(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('duoListData', DuoListDataDirective);

    /** ngInject */
    function DuoListDataDirective() {
        return {
            restrict: 'AE',
            templateUrl: 'components/duo-list-data/duo-list-data.html',
            controller: DuoListDataCtrl
        };
    }

    /** ngInject */
    function DuoListDataCtrl($log, $scope, ListDataService, dataTableConfigService, PagesService) {
        var vm = $scope;
        $log.info('DuoListDataCtrl');

        _renderDataTable();

        function _renderDataTable() {
            var numberOfColumns = 1;
            var columnsHasNotOrder = [0];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'title'
            }]);

            function getPages(params, fnCallback) {
                PagesService
                    .getPages(dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        vm.pagesTable = res.data;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);
                    });
            }
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getPages, {
                displayLength: 10,
                paginationType: 'numbers'
            });
        }
    }
})();
