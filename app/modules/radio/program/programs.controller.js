(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramsController', ProgramsController);

    /** ngInject */
    function ProgramsController(dataTableConfigService, RadioService, PermissionService) {
        var vm = this;

        vm.dtInstance = {};
        vm.dtOptions = {};
        vm.dtColumns = {};
        vm.listPrograms = [];

        activate();

        ////////////////

        function _renderDataTable() {
            var numberOfColumns = 4;
            var columnsHasNotOrder = [3];
            dataTableConfigService.setColumnsHasOrderAndSearch([
                { index: 0, name: 'title' },
                { index: 1, filter: 'author', name: 'name' },
                { index: 2, name: 'postDate' }
            ]);
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getProgramas);
        }

        function getProgramas(params, cb) {
            let numberOfColumns = 4;
            let columnsHasNotOrder = [];
            RadioService.listPrograms(dataTableConfigService.getParams(params))
                .then(function(res) {
                    console.log('listPrograms', res);
                    // _permissions();
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
            vm.canPut = PermissionService.canPut('tags');
            vm.canDelete = PermissionService.canDelete('tags');
            vm.canPost = PermissionService.canPost('tags');
        }

        function activate() {
            _renderDataTable();
        }


    }
})();