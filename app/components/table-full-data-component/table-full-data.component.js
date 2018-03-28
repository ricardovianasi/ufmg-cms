(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('componentsModule')
        .component('tableFullData', {
            templateUrl: 'components/table-full-data-component/table-full-data.component.html',
            controller: TableFullDataController,
            controllerAs: 'ctrlTable',
            bindings: {
                fullDatas: '<',
                config: '<',
                limit: '<'
            },
        });

    /** ngInject */
    function TableFullDataController() {
        let ctrlTable = this;

        ctrlTable.getTotCols = getTotCols;
        ctrlTable.changeTable = changeTable;
        ctrlTable.showPagination = showPagination;

        ////////////////

        ctrlTable.$onDestroy = function() { };

        function showPagination() {
            return (ctrlTable.fullDatasFiltered.length / ctrlTable.limit) > 1; 
        }

        function changeTable() {
            setBoundResults();
        }

        function setBoundResults() {
            let startBound = ctrlTable.limit * (ctrlTable.configPagination.page - 1);
            ctrlTable.boundResults = {
                start: startBound + 1,
                end: startBound + ctrlTable.limit
            };
        }

        function getTotCols() {
            let lengthCols = ctrlTable.config.cols ? ctrlTable.config.cols.length : 0;
            let lengthColsActions = ctrlTable.config.actions ? ctrlTable.config.actions.length : 0;
            return lengthCols + lengthColsActions;
        }

        function _initVariables() {
            ctrlTable.configPagination = { page: 1 };
            ctrlTable.fullDatasFiltered = [];
            setBoundResults();
        }

        ctrlTable.$onInit = function() {
            _initVariables();
        };
    }
})();