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
                cols: '<',
                limit: '<'
            },
        });

    /** ngInject */
    function TableFullDataController() {
        let ctrlTable = this;
        

        ////////////////

        ctrlTable.$onInit = function() { };
        ctrlTable.$onChanges = function(changesObj) { };
        ctrlTable.$onDestroy = function() { };
    }
})();