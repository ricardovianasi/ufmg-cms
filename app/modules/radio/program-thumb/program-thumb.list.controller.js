(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramThumbListController', ProgramThumbListController);

    /** ngInject */
    function ProgramThumbListController(RadioService, dataTableConfigService, PermissionService) {
        var vm = this;

        vm.dtInstance = {};
        vm.dtOptions = {};
        vm.dtColumns = {};
        vm.listPrograms = [];


        activate();

        ////////////////

        function _renderDataTable() {
            dataTableConfigService.setColumnsHasOrderAndSearch([
                { index: 0, name: 'title' },
                { index: 2, filter: 'author', name: 'name' },
            ]);
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getProgramas);
        }

        function getProgramas(params, cb) {
            let numberOfColumns = 3;
            let columnsHasNotOrder = [];
            RadioService.listPrograms(dataTableConfigService.getParams(params))
                .then(function(res) {
                    _permissions();
                    vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                    vm.listPrograms = res.data.items;
                    let records = {
                        'draw': params.draw,
                        'recordsTotal': res.data.total,
                        'data': [],
                        'recordsFiltered': res.data.total
                    };
                    cb(records);
                });

        }

        function _permissions() {
            vm.canPut = PermissionService.canPut('radio_thumb');
            vm.canDelete = PermissionService.canDelete('radio_thumb');
            vm.canPost = PermissionService.canPost('radio_thumb');
        }

        function activate() {
            _renderDataTable();
        }
    }
})();
