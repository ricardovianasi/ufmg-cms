(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ParentListController', ParentListController);

    /** ngInject */
    function ParentListController(dataTableConfigService, RadioService, PermissionService, NotificationService, ModalService) {
        var vm = this;

        vm.registerParent = registerParent;
        vm.removeParent = removeParent;
        vm.openUpdateParent = openUpdateParent;

        vm.dtInstance = {};
        vm.dtOptions = {};
        vm.dtColumns = {};
        vm.listParent = [];

        vm.nameCategory = '';
        vm.loading = false;

        activate();

        ////////////////

        function openUpdateParent(parent, idx) {
            let modal = ModalService.inputModal('Edição do nome do bloco', 'Nome', parent.name, 
                ModalService.MODAL_MEDIUM, {required: true});
            modal.result.then(function (name) {
                parent.name = name;
                _updateParent(parent, idx);
            })
            .catch(function () { console.log('catch modal categ'); });
        }

        function removeParent(id, name, idx) {
            let msgConfirm = 'Voce tem certeza que deseja remover o bloco <b>' + name + '</b>?';
            ModalService.confirm(msgConfirm, ModalService.MODAL_MEDIUM, {isDanger: true}).result
                .then(function() { _removeParent(id, name, idx); })
                .catch(function() { console.log('catch modal delete'); });
        }

        function registerParent() {
            if(!vm.nameCategory) { return; }
            vm.loading = true;
            RadioService.registerItemFilter({name: vm.nameCategory}, RadioService.baseUrlParent)
                .then(function(data) {
                    NotificationService.success('Bloco cadastrado com sucesso.');
                    vm.listParent.unshift(data.data);
                    vm.nameCategory = '';
                })
                .catch(function(error) { console.error(error); })
                .finally(function() { vm.loading = false; });
        }

        function _updateParent(parent, idx) {
            RadioService.updateItemFilter(parent, parent.id, RadioService.baseUrlParent)
                .then(function () {
                    vm.listParent[idx] = parent;
                    NotificationService.success('Bloco alterada com sucesso!');
                });
        }

        function _removeParent(id, name, idx) {
            RadioService.deleteItemFilter(id, RadioService.baseUrlParent)
                .then(function() {
                    vm.listParent.splice(idx, 1);
                    if(vm.listParent.length <= 1) {
                        vm.dtInstance.DataTable.draw();
                    }
                    NotificationService.success('Bloco ' + name + ' removido com sucesso!');
                });
        }

        function _renderDataTable() {
            dataTableConfigService.setColumnsHasOrderAndSearch([
                { index: 0, name: 'name' },
            ]);
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getProgramas);
        }

        function getProgramas(params, cb) {
            let numberOfColumns = 2;
            let columnsHasNotOrder = [];
            RadioService.listItemFilter(dataTableConfigService.getParams(params), RadioService.baseUrlParent)
                .then(function(res) {
                    _permissions();
                    vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                    vm.listParent = res.data.items;
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
            vm.canPut = PermissionService.canPut('radio_category');
            vm.canDelete = PermissionService.canDelete('radio_category');
            vm.canPost = PermissionService.canPost('radio_category');
            vm.canActions = vm.canPut && vm.canDelete;
        }

        function activate() {
            _renderDataTable();
        }
    }
})();