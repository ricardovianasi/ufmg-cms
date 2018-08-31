(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramsController', ProgramsController);

    /** ngInject */
    function ProgramsController(dataTableConfigService, RadioService, PermissionService, NotificationService, ModalService) {
        var vm = this;

        vm.dtInstance = {};
        vm.dtOptions = {};
        vm.dtColumns = {};
        vm.listPrograms = [];

        vm.showButtonEdit = showButtonEdit;
        vm.removeProgram = removeProgram;

        activate();

        ////////////////

        function _renderDataTable() {
            dataTableConfigService.setColumnsHasOrderAndSearch([
                { index: 0, name: 'title' },
                { index: 1, filter: 'genres', name: 'name' },
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

        function removeProgram(program) {
            let msg = 'Você realmente deseja apagar o programa ' + program.title + '?';
            ModalService.confirm(msg, ModalService.MODAL_MEDIUM, {isDanger: true}).result
                .then(function() { _removeProgram(program.id); })
                .catch(function(error) { console.error(error); });
        }

        function showButtonEdit(item) {
            return PermissionService.canPut('radio_programming', item.id);
        }

        function _removeProgram(id) {
            RadioService.deleteProgram(id)
                .then(function() {
                    NotificationService.success('O programa foi removido com sucesso.');
                    let idx = vm.listPrograms.findIndex(function(program) { return program.id === id; });
                    vm.listPrograms.splice(idx, 1);
                });
        }

        function _permissions() {
            vm.canPut = PermissionService.canPut('radio_programming');
            vm.canDelete = PermissionService.canDelete('radio_programming');
            vm.canPost = PermissionService.canPost('radio_programming');
        }

        function activate() {
            _renderDataTable();
        }


    }
})();