(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramsController', ProgramsController);

    /** ngInject */
    function ProgramsController(dataTableConfigService) {
        var vm = this;

        vm.dtInstance = {};
        vm.dtOptions = {};
        vm.dtColumns = {};

        activate();

        ////////////////

        function _renderDataTable() {
            var numberOfColumns = 4;
            var columnsHasNotOrder = [3];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'title'
            }, {
                index: 1,
                filter: 'author',
                name: 'name'
            }, {
                index: 2,
                name: 'postDate'
            }]);
        }

        function activate() { }


    }
})();