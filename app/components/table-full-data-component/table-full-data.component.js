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

        ////////////////

        ctrlTable.$onInit = function() { };
        ctrlTable.$onChanges = function(changesObj) { };
        ctrlTable.$onDestroy = function() { };

        function getTotCols() {
            let lengthCols = ctrlTable.config.cols ? ctrlTable.config.cols.length : 0;
            let lengthColsActions = ctrlTable.config.actions ? ctrlTable.config.actions.length : 0;
            return lengthCols + lengthColsActions;
        }
    }
})();